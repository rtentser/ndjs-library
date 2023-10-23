// require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");

const authRoute = require("./routes/auth");
const booksRoute = require("./routes/books");
const errorMiddleware = require("./middleware/error");

const app = express();
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

const start = async (port, db) => {
  try {
    await mongoose.connect(db);
    app.listen(port);
  } catch (e) {}
};

start(PORT, process.env.URL_DB);
