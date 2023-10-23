const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const Users = require("../models/user.js");
const router = express.Router();

const verify = async (username, password, done) => {
  const user = await Users.findOne({ username: username, password: password });

  if (user) return done(null, user);
  else return done(null, false);
};

const options = {
  usernameField: "username",
  passwordField: "password",
};

passport.use("local", new LocalStrategy(options, verify));
passport.serializeUser((user, cb) => {
  cb(null, user._id);
});
passport.deserializeUser(async (id, cb) => {
  const user = await Users.findById(id);

  if (user) return cb(null, user);
  else return cb("User's not found");
});

router.get("/login", async (req, res) => {
  res.render("login");
});

router.get("/me", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect("/api/user/login");
  } else {
    res.render("profile", { user: req.user });
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/api/user/me",
    failureRedirect: "/api/user/login",
  })
);

router.post("/signup", async (req, res) => {
  const { username, password, displayName } = req.body;
  const newUser = new Users({
    username,
    password,
    displayName,
  });
  try {
    await newUser.save();
    console.log("Success!");
    res.redirect("/api/user/login");
  } catch (e) {
    console.error(e);
    res.redirect("/404");
  }
});

router.get("/logout", async (req, res) => {
  req.logout(() => {});
  res.redirect("/api/user/login");
});

module.exports = router;
