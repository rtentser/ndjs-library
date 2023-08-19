const { v4: uuid } = require("uuid");
const express = require("express");
const upload = require("../middleware/file");
const axios = require("axios").default;

const router = express.Router();

class Book {
  constructor(
    title = "",
    description = "",
    authors = "",
    favorite = "",
    fileCover = "",
    fileName = "",
    fileBook = "",
    id = uuid()
  ) {
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover;
    this.fileName = fileName;
    this.fileBook = fileBook;
    this.id = id;
  }
}

const stor = {
  library: [],
};

router.get("/", (req, res) => {
  const { library } = stor;
  res.render("index", {
    title: "Library",
    library: library,
  });
});

router.get("/create", (req, res) => {
  res.render("create", {
    title: "Book | create",
    book: {},
  });
});

router.post("/create", (req, res) => {
  const { library } = stor;
  const { title, description, authors } = req.body;

  const newBook = new Book(title, description, authors);
  library.push(newBook);

  res.redirect("/api/books");
});

router.get("/:id", async (req, res) => {
  const { library } = stor;
  const { id } = req.params;
  const idx = library.findIndex((el) => el.id === id);

  if (idx === -1) {
    res.redirect("/404");
  }

  console.log(`http://counter:3001/counter/${id}/incr`);
  await axios.post(`http://counter:3001/counter/${id}/incr`);
  let views = await axios.get(`http://counter:3001/counter/${id}`);

  res.render("view", {
    title: "Book | view",
    book: library[idx],
    views: views.data,
  });
});

router.get("/:id/update", (req, res) => {
  const { library } = stor;
  const { id } = req.params;
  const idx = library.findIndex((el) => el.id === id);

  if (idx === -1) {
    res.redirect("/404");
  }

  res.render("update", {
    title: "Book | view",
    book: library[idx],
  });
});

router.post("/:id/update", (req, res) => {
  const { library } = stor;
  const { title, description, authors } = req.body;
  const { id } = req.params;
  const idx = library.findIndex((el) => el.id === id);

  if (idx === -1) {
    res.redirect("/404");
  }

  library[idx].title = title;
  library[idx].description = description;
  library[idx].authors = authors;

  res.redirect(`/api/books/${id}`);
});

router.post("/:id/delete", (req, res) => {
  const { library } = stor;
  const { id } = req.params;
  const idx = library.findIndex((el) => el.id === id);

  if (idx === -1) {
    res.redirect("/404");
  }

  library.splice(idx, 1);
  res.redirect("/api/books");
});

router.post("/:id/upload", upload.single("book"), (req, res) => {
  const { library } = stor;
  const { id } = req.params;
  const idx = library.findIndex((el) => el.id === id);

  if (idx !== -1) {
    // TODO: can rename file to accepted standard
    library[idx].fileName = req.file.filename;
    library[idx].fileBook = req.file.path;
    res.json(library[idx]);
  } else {
    res.status(404);
    res.json("404 | страница не найдена");
    // TODO: Should also remove uploaded file
  }
});

router.get("/:id/download", (req, res) => {
  const { library } = stor;
  const { id } = req.params;
  const idx = library.findIndex((el) => el.id === id);

  if (idx !== -1) {
    const path = library[idx].fileBook;
    res.download(path);
  } else {
    res.status(404);
    res.json("404 | страница не найдена");
  }
});

module.exports = router;
