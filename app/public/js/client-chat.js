
let socket = io();

//query string 
const queryString = location.search;
const params = Qs.parse(queryString, {
  ignoreQueryPrefix: true
})
const { room, username } = params;
const localUser = username;

// gui tin nhan cho server
document.getElementById("form-messages").addEventListener("submit", (e) => {
  e.preventDefault();
  let message = document.getElementById("input-messages").value;
  let acknowledgements = (err) => {
    if (err) {
      return alert("Tin nhan khong hop le!");
    }
    console.log("Send successfully");
  }
  socket.emit("send messages to server", message, acknowledgements);
})
// nhan tin nhan tu server
socket.on("send messages to client", (messages) => {
  let { message, createAt, username } = messages;
  let messageContent = document.getElementById("app__messages").innerHTML;

  if (localUser === username) {
    messageContent += `
      <div class="message-right text-right">
      <div class="message-item">
        <div class="message__row1 message-local">
          <p class="message__name">${username}</p>
          <p class="message__date">${createAt}</p>
        </div>
        <div class="message__row2">
          <p class="message__content">
            ${message}
          </p>
        </div>
      </div>
    </div>
      `
  } else if (username === "Admin") {
    messageContent += `
    <div class="message-left text-center admin-announ">
    <div class="message-item">
    <div class="message__row1 justify-content-center">
      <p class="message__name">${username}</p>
      <p class="message__date">${createAt}</p>
    </div>
    <div class="message__row2">
      <p class="message__content">
        ${message}
      </p>
    </div>
  </div>
  </div>
    `
  }else {
    messageContent += `
    <div class="message-left">
    <div class="message-item">
    <div class="message__row1">
      <p class="message__name">${username}</p>
      <p class="message__date">${createAt}</p>
    </div>
    <div class="message__row2">
      <p class="message__content">
        ${message}
      </p>
    </div>
  </div>
  </div>
    `
  }

  document.getElementById("app__messages").innerHTML = messageContent;
  document.getElementById("input-messages").value = "";
})
//share location

document.getElementById("btn-share-location").addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    socket.emit("share location to server", { latitude, longitude });
  })
})
// nhan vi tri tu server chuyen cho cac client khac
socket.on("share location to client", (messages) => {
  let { message, createAt, username } = messages;
  let messageContent = document.getElementById("app__messages").innerHTML;
  if (localUser === username) {
    messageContent += `
      <div class="message-right text-right">
      <div class="message-item">
        <div class="message__row1 message-local">
          <p class="message__name">${username}</p>
          <p class="message__date">${createAt}</p>
        </div>
        <div class="message__row2">
          <p class="message__content">
          <a href=${message} target="_blank" rel="noopener noreferrer">Click to see ${username}'s location</a>
          </p>
        </div>
      </div>
    </div>
      `
  }else {
    messageContent += `
    <div class="message-left">
    <div class="message-item">
    <div class="message__row1">
      <p class="message__name">${username}</p>
      <p class="message__date">${createAt}</p>
    </div>
    <div class="message__row2">
      <p class="message__content">
      <a href=${message} target="_blank" rel="noopener noreferrer">Click to see ${username}'s location</a>
      </p>
    </div>
  </div>
  </div>
    `
  }

  document.getElementById("app__messages").innerHTML = messageContent;
  document.getElementById("input-messages").value = "";
})
// show user list
socket.on("send user list to client", (userList) => {
  let content = "";
  userList.map((item, index) => {
    content += `
    <li class="app__item-user">${item.username}</li>
    `
  })
  document.getElementById("app__list-user--content").innerHTML = content;

})
socket.emit("join room to server", { room, username });

document.getElementById("app__title").innerHTML = room;

