let userList = [
    {
        id: 1,
        username: "Tran van phu",
        room: "ro01"
    },
    {
        id: 2,
        username: "Nguyen thi duyen",
        room: "ro02"
    },
    {
        id: 3,
        username: "Le ngoc hai",
        room: "ro01"
    }
];

const addUser = (newUser)=> {
    return userList = [...userList, newUser]
}

const removeUser = (id)=>{
    let index = userList.findIndex(item=>item.id === id);
    if(index !==-1){
        userList.splice(index, 1);
    }
    return userList;
}

const getUserList = (room)=>{
    return userList.filter(user=>user.room === room);
}

const findUser = (id)=>{
    return userList.find(user=>user.id === id);
}

module.exports = {
    getUserList, 
    addUser, 
    removeUser,
    findUser
}