"use strict";

let connection = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/test")
    .configureLogging(signalR.LogLevel.Information)
    .build();

const nameForm = document.getElementById("name-form");
const gameContainer = document.getElementById("game-container");
const chatContainer = document.getElementById("chat-container");

nameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const groupName = document.getElementById("group-name").value;
    registerUser(username, groupName);

    nameForm.style.display = "none";
    gameContainer.style.display = "block";
});

async function registerUser(username, groupName) {
    await connection.start().then(() => {
        console.log("Successfully connected");
        player = new Player(username);
        player.AddComponent(Movement);
    }).catch((error) => console.error(error));

    await connection.invoke("RegisterUser", username, groupName);
    connection.invoke("GetPlayerPositions").then(start);
}


function sendMessage(message) {
    connection.invoke("SendMessage", message).catch((error) => console.error(error));
}


connection.on("PlayerJoined", (username) => {
    if (username !== player.transform.name)
        new Player(username);
    chatContainer.innerHTML += `<p style="color: green">${username} joined</p>`;
});

connection.on("PlayerLeft", (username) => {
    Player.FindPlayerByName(username).Destroy();
    chatContainer.innerHTML += `<p style="color: red">${username} left</p>`;
});

connection.on("ReceiveMessage", (username, message) => {
    chatContainer.innerHTML += `<p><span style="color:orange">${username}</span>: ${message}</p>`
});

connection.on("SetPlayerPosition", (username, x, y) => {
    var player = Player.FindPlayerByName(username);

    if (typeof player !== "undefined")
        player.transform.position.Add(x, y);
});

connection.on("ReceivePlayerPositions", (positions, names) => {
    for (let i = 0; i < names.length; i++) {
        new Player(names[i], new Vector2(positions[i * 2], positions[i * 2 + 1]));
    }
});

//connection.on("Print", (obj) => console.log(obj));