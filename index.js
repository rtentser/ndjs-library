const express = require("express");

const userRoute = require("./routes/user");
const booksRoute = require("./routes/books");

const app = express();
app.use(express.json());

app.use("/api/user", userRoute);
app.use("/api/books", booksRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT);
