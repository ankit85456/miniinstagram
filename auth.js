const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ========================
// SHOW SIGNUP PAGE
// ========================
router.get("/signup", (req, res) => {
  res.render("signup", { error: null });
});

// ========================
// SHOW LOGIN PAGE
// ========================
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// ========================
// SIGNUP
// ========================
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.render("signup", {
        error: "All fields are required"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("signup", {
        error: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword
    });

    res.redirect("/auth/login");

  } catch (error) {
    console.log(error);
    res.render("signup", {
      error: "Something went wrong"
    });
  }
});

// ========================
// LOGIN
// ========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("login", {
        error: "All fields are required"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.render("login", {
        error: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", {
        error: "Wrong password"
      });
    }

    // Token generate and set in cookie
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    // Redirect to posts/feed page
    res.redirect("/posts");

  } catch (error) {
    console.log(error);
    res.render("login", {
      error: "Something went wrong"
    });
  }
});

// ========================
// LOGOUT
// ========================
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/auth/login");
});

module.exports = router;