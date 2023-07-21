const express = require("express");

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
app.listen(PORT);
