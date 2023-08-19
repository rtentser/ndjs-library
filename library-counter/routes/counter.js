const express = require("express");
const fs = require("node:fs/promises");
const router = express.Router();

router.post("/:id/incr", async (req, res) => {
  let counters;
  try {
    counters = JSON.parse(await fs.readFile("/storage/counter"));
  } catch (e) {
    counters = {};
  }

  let id = req.params.id;
  if (!counters[id]) counters[id] = 0;
  counters[id]++;

  await fs.writeFile("/storage/counter", JSON.stringify(counters));
  res.send("Ok");
});

router.get("/:id", async (req, res) => {
  let counters;
  try {
    counters = JSON.parse(await fs.readFile("/storage/counter"));
  } catch (e) {
    counters = {};
  }

  let id = req.params.id;
  if (!counters[id]) counters[id] = 0;

  res.send(counters[id].toString());
});

module.exports = router;
