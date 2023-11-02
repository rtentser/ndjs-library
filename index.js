require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");

const http = require("http");
const socketIO = require("socket.io");

const authRoute = require("./routes/auth");
const booksRoute = require("./routes/books");
const errorMiddleware = require("./middleware/error");

const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.use(express.json());
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "SECRET", resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/user", authRoute);
app.use("/api/books", booksRoute);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log("connected");
  const roomName = socket.handshake.query.roomName;

  socket.join(roomName);
  socket.on("comment", (msg) => {
    msg.type = "comment";
    socket.to(roomName).emit("comment", msg);
    socket.emit("comment", msg);
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});

const start = async (port, db) => {
  try {
    await mongoose.connect(db);
    server.listen(port);
  } catch (e) {
    console.error(e);
  }
};

start(PORT, process.env.URL_DB);
