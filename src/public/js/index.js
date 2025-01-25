const socket = io();

let user;


Swal.fire({ 
    title: 'Identificate',
    input: 'text',
    text: 'Ingresa el usuario para identificarte en el chat',
    inputValidator: (value) => {
        if (!value) {
            return 'Debes ingresar un usuario'
        }
    },
    allowOutsideClick: false
}).then((result) => {
    user = result.value;
    socket.emit("authenticated", user);
});


socket.on("messageLogs", (data) => {
    let log = document.getElementById("messageLogs");
    let messages = "";
    data.forEach((message) => {
        messages = messages+ `${message.user} dice: ${message.message} <br/>`;
    });
    log.innerHTML = messages;
});

socket.on("newUserConnected", (username) => {
    Swal.fire({
        text: `${username} se ha unido al chat`,
        toast: true,
        position: "top-right",
        timer: 10000,
        showConfirmButton: false,
        icon: "info"
    });
});

let chatBox = document.getElementById("chatBox")

chatBox.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        if((chatBox.value).trim().length > 0){
            socket.emit("message", {user: user, message: chatBox.value});
            chatBox.value = "";
        }
    }
});