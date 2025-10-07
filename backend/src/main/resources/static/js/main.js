"use strick";
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

  // connectingElement.classList.add("hidden");
  // messageForm.classList.remove("hidden");
  // // chatArea.classList.remove("hidden");
  // messageForm.addEventListener("submit", sendMessage, true);
}

function onError() {}

function onMessageReceived() {}

usernameForm.addEventListener("submit", connect, true);
