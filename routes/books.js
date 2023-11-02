const express = require("express");
const upload = require("../middleware/file");
const axios = require("axios").default;
const Books = require("../models/book.js");

const router = express.Router();

router.get("/", async (req, res) => {
  const library = await Books.find().select("-__v");
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

router.post("/create", async (req, res) => {
  const { title, description, authors } = req.body;

  const newBook = new Books({ title, description, authors });
  try {
    await newBook.save();
    res.redirect("/api/books");
  } catch (e) {
    console.error(e);
    res.redirect("/404");
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  let book;

  try {
    book = await Books.findById(id).select("-__v");
    await axios.post(`http://localhost:3001/counter/${id}/incr`);
    let views = await axios.get(`http://localhost:3001/counter/${id}`);

    res.render("view", {
      title: "Book | view",
      book: book,
      views: views.data,
    });
  } catch (e) {
    console.error(e);
    res.redirect("/404");
  }
});

router.get("/:id/update", async (req, res) => {
  const { id } = req.params;
  let book;

  try {
    book = await Books.findById(id).select("-__v");
    res.render("update", {
      title: "Book | view",
      book: book,
    });
  } catch (e) {
    console.error(e);
    res.redirect("/404");
  }
});

router.post("/:id/update", async (req, res) => {
  const { title, description, authors } = req.body;
  const { id } = req.params;

  try {
    await Books.findByIdAndUpdate(id, { title, description, authors }).select(
      "-__v"
    );
    res.redirect(`/api/books/${id}`);
  } catch (e) {
    console.error(e);
    res.redirect("/404");
  }
});

router.post("/:id/delete", async (req, res) => {
  const { id } = req.params;

  try {
    await Books.deleteOne({ _id: id });
    res.redirect("/api/books");
  } catch (e) {
    console.error(e);
    res.redirect("/404");
  }
});

// router.post("/:id/upload", upload.single("book"), (req, res) => {
//   const { library } = stor;
//   const { id } = req.params;
//   const idx = library.findIndex((el) => el.id === id);

//   if (idx !== -1) {
//     // TODO: can rename file to accepted standard
//     library[idx].fileName = req.file.filename;
//     library[idx].fileBook = req.file.path;
//     res.json(library[idx]);
//   } else {
//     res.status(404);
//     res.json("404 | страница не найдена");
//     // TODO: Should also remove uploaded file
//   }
// });

// router.get("/:id/download", (req, res) => {
//   const { library } = stor;
//   const { id } = req.params;
//   const idx = library.findIndex((el) => el.id === id);

//   if (idx !== -1) {
//     const path = library[idx].fileBook;
//     res.download(path);
//   } else {
//     res.status(404);
//     res.json("404 | страница не найдена");
//   }
// });

module.exports = router;
