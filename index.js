const express = require("express");
const { v4: uuid } = require("uuid");

class Book {
  constructor(
    title = "",
    description = "",
    authors = "",
    favorite = "",
    fileCover = "",
    fileName = "",
    id = uuid()
  ) {
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover;
    this.fileName = fileName;
    this.id = id;
  }
}

const stor = {
  library: [],
};

const app = express();
app.use(express.json());

app.post("/api/user/login", (req, res) => {
  res.status(201);
  res.json({ id: 1, mail: "test@mail.ru" });
});

app.get("/api/books", (req, res) => {
  const { library } = stor;
  res.json(library);
});

app.get("/api/books/:id", (req, res) => {
  const { library } = stor;
  const { id } = req.params;
  const idx = library.findIndex((el) => el.id === id);

  if (idx !== -1) {
    res.json(library[idx]);
  } else {
    res.status(404);
    res.json("404 | страница не найдена");
  }
});

app.post("/api/books/", (req, res) => {
  const { library } = stor;
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;

  const newBook = new Book(
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName
  );
  library.push(newBook);

  res.status(201);
  res.json(newBook);
});

app.put("/api/books/:id", (req, res) => {
  const { library } = stor;
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;
  const { id } = req.params;
  const idx = library.findIndex((el) => el.id === id);

  if (idx !== -1) {
    const changedBook = new Book(
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
      library[idx].id
    );
    library[idx] = changedBook;

    res.json(library[idx]);
  } else {
    res.status(404);
    res.json("404 | страница не найдена");
  }
});

app.delete("/api/books/:id", (req, res) => {
  const { library } = stor;
  const { id } = req.params;
  const idx = library.findIndex((el) => el.id === id);

  if (idx !== -1) {
    library.splice(idx, 1);
    res.json(true);
  } else {
    res.status(404);
    res.json("404 | страница не найдена");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
