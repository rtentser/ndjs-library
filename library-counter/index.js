const express = require("express");

const counterRoute = require("./routes/counter");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/counter", counterRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
