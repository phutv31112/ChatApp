
const express = require('express');

const htttp = require('http');
const path = require('path');
const app = express();

const server = htttp.createServer(app);
const {Server} = require('socket.io');

const io = new Server(server);

const {createMessages} = require('./utils/create-messages');
const {removeUser, getUserList, addUser} = require('./utils/users');

const Filter = require('bad-words');

const pathPublicDirectory = path.join(__dirname, "../public");

app.use(express.static(pathPublicDirectory));

io.on('connection', (socket) => {
    //join room 
    socket.on("join room to server", ({room, username})=>{
        socket.join(room);
        socket.emit("send messages to client", createMessages(`Welcome to room ${room}`,"Admin"));
        socket.broadcast.to(room).emit("send messages to client", createMessages(`user ${username} has just joined in ${room}`, "Admin"));

        //chat
        socket.on("send messages to server", (message, callback)=>{
            let filter = new Filter();
            if(filter.isProfane(message)){
                return callback("Tin nhan khong hop le vi co chua tu tuc tiu!");
            }
            callback();
            io.to(room).emit("send messages to client", createMessages(message, username));
        })
        //share location
        socket.on("share location to server", ({latitude, longitude})=>{
            const link = `https://www.google.com/maps?q=${latitude},${longitude}`;
            io.to(room).emit("share location to client", createMessages(link, username));
        })
        //get user list
        let newUser = 
            {
                id: socket.id,
                username,
                room
            }
        addUser(newUser);
        io.to(room).emit("send user list to client", getUserList(room));
    
        //disconnect
        socket.on('disconnect', () => {
            removeUser(socket.id);
            io.to(room).emit("send user list to client",getUserList(room))
            console.log('user disconnected');
            socket.broadcast.to(room).emit("send messages to client", createMessages(`user ${username} has left to room`, "Admin"));
        });
    })

  });

const port = 5000;
server.listen(port, ()=>{
    console.log(`app listen at http://localhost:${port}`);
})