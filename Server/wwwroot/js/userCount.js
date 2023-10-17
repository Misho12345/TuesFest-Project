var connectionUserCount = new signalR.HubConnectionBuilder().withUrl("/hubs/userCount").build();

connectionUserCount.on("updateTotalViews", (value) => {
    var newCountSpan = document.getElementById("totalViewsCounter");
    newCountSpan.innerText = value.toString();
});

function newWindowLoadedOnClient() {
    connectionUserCount.send("NewWindowLoaded");
}

function fulfilled() {
    console.log("Successful connection");
    newWindowLoadedOnClient();
}

function rejected() {
    console.log("Unsuccessful connection");
}

connectionUserCount.start().then(fulfilled, rejected)