import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import {Server} from "socket.io";

const app = express();
const PORT = 8080;

const httpServer = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = new Server(httpServer);

let messages = [];

io.on("connection", (socket) => {
  console.log("New connection");

  // Escuchar autenticación de usuario
  socket.on("authenticated", (username) => {
    console.log(`${username} se ha autenticado`);

    // Enviar los logs del chat al usuario autenticado
    socket.emit("messageLogs", messages);

    // Notificar a los demás usuarios que un nuevo usuario se ha conectado
    socket.broadcast.emit("newUserConnected", username);
});

   // Escuchar mensajes enviados
   socket.on("message", (data) => {
    messages.push(data);
    io.emit("messageLogs", messages);
});
});

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.use("/", viewsRouter);