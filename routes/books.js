const { v4: uuid } = require("uuid");
const express = require("express");
const upload = require("../middleware/file");

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
  res.json(library);
});

router.get("/:id", (req, res) => {
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

router.post("/", (req, res) => {
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

router.put("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
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
