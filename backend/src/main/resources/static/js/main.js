"use strict";
const usernamePage = document.querySelector("#username-page");
const chatPage = document.querySelector("#chat-page");
const usernameForm = document.querySelector("#usernameForm");
const messageForm = document.querySelector("#messageForm");
const messageInput = document.querySelector("#message");
const connectingElement = document.querySelector(".connecting");
const chatArea = document.querySelector("#chat-messages");
const logout = document.querySelector("#logout");

let stompClient = null;
let nickname = null;
let fullname = null;
let selectedUser = null;

function connect(event) {
  nickname = document.querySelector("#name").value.trim();
  fullname = document.querySelector("#fullname").value.trim();

  if (nickname && fullname) {
    usernamePage.classList.add("hidden");
    chatPage.classList.remove("hidden");

    const socket = new SockJS("/ws");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, onConnected, onError);
  }
  event.preventDefault();
}

function onConnected() {
  stompClient.subscribe(`/user/${nickname}/queue/messages`, onMessageReceived);
  stompClient.subscribe(`/user/topic`, onMessageReceived);

  // Registering the connected user
  stompClient.send(
    "/app/chat.addUser",
    {},
    JSON.stringify({ nickName: nickname, fullName: fullname, status: "ONLINE" })
  );

  // find and desplay the connected users
  findAndDisplayConnectedUsers().then();
}

async function findAndDisplayConnectedUsers() {
  const connectedUsersResponse = await fetch("/users");
  let connectedUsers = await connectedUsersResponse.json();

  connectedUsers = connectedUsers.filter((user) => user.nickName !== nickname);
  const connectedUsersList = document.getElementById("connectedUsers");
  connectedUsersList.innerHTML = "";

  connectedUsers.forEach((user) => {
    appendUserElement(user, connectedUsersList);
    if (connectedUsers.index(user) === connectedUsers.length - 1) {
      // add a seperator
      const separator = document.createElement("li");
      separator.classList.add("separator");
      connectedUsersList.appendChild(separator);
    }
  });
}

function appendUserElement(user, listElement) {
  const listItem = document.createElement("li");
  listItem.classList.add("user-item");
  listItem.id = user.nickName;

  const userImg = document.createElement("img");
  userImg.src = "../img/user.png";
  userImg.alt = user.fullName;

  const usernameSpan = document.createElement("span");
  usernameSpan.textContent = user.fullName;

  const receivedMsgs = document.createElement("span");
  receivedMsgs.textContent = "0";
  receivedMsgs.classList.add("nbr-msg", "hidden");

  listItem.appendChild(userImg);
  listItem.appendChild(usernameSpan);
  listItem.appendChild(receivedMsgs);

  connectedUsersList.appendChild(listItem);
}

function onError() {}

function onMessageReceived() {}

usernameForm.addEventListener("submit", connect, true);
