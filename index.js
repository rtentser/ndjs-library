const express = require("express");
const mongoose = require("mongoose");

const userRoute = require("./routes/user");
const booksRoute = require("./routes/books");
const errorMiddleware = require("./middleware/error");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.use("/api/user", userRoute);
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
