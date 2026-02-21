require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();

// =====================
// View Engine Setup
// =====================
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// =====================
// Middlewares
// =====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// =====================
// Routes
// =====================
const authRoutes = require("./routes/auth");
const postsRoutes = require("./routes/posts");

app.use("/auth", authRoutes);
app.use("/posts", postsRoutes);

// Static files for uploads
app.use("/uploads", express.static("uploads"));

// Test Route / Home
app.get("/", (req, res) => {
  if (req.cookies.token) {
    return res.redirect("/posts");
  }
  res.redirect("/auth/signup");
});

// =====================
// MongoDB Connection
// =====================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));

// =====================
// Server Listen
// =====================
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});