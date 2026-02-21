const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const checkAuth = require("../middleware/checkAuth");
const multer = require("multer");
const path = require("path");

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Helper function to normalize posts (convert old likes format to array)
const normalizePosts = (posts) => {
  return posts.map(post => {
    if (!Array.isArray(post.likes)) {
      post.likes = [];
    }
    return post;
  });
};

// ========================
// GET FEED (Show all posts)
// ========================
router.get("/", checkAuth, async (req, res) => {
  try {
    let posts = await Post.find().sort({ createdAt: -1 });
    posts = normalizePosts(posts);
    const user = await User.findById(req.userId);
    
    res.render("feed", { 
      posts, 
      user: user.username,
      userId: req.userId,
      error: null
    });
  } catch (error) {
    console.log(error);
    res.render("feed", { 
      posts: [],
      user: "User",
      error: "Failed to load posts" 
    });
  }
});

// ========================
// GET UPLOAD POST PAGE
// ========================
router.get("/upload", checkAuth, (req, res) => {
  res.render("upload", { error: null });
});

// ========================
// POST CREATE NEW POST
// ========================
router.post("/upload", checkAuth, upload.single("image"), async (req, res) => {
  try {
    const { caption } = req.body;

    if (!req.file) {
      return res.render("upload", {
        error: "Please upload an image"
      });
    }

    const user = await User.findById(req.userId);

    const newPost = await Post.create({
      userId: req.userId,
      username: user.username,
      caption,
      image: "/uploads/" + req.file.filename
    });

    res.redirect("/posts");

  } catch (error) {
    console.log(error);
    res.render("upload", {
      error: "Failed to upload post"
    });
  }
});

// ========================
// GET MY POSTS
// ========================
router.get("/my-posts", checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    let posts = await Post.find({ userId: req.userId }).sort({ createdAt: -1 });
    posts = normalizePosts(posts);

    res.render("my-posts", {
      posts,
      username: user.username,
      error: null
    });
  } catch (error) {
    console.log(error);
    res.render("my-posts", { 
      posts: [],
      error: "Failed to load your posts" 
    });
  }
});

// ========================
// GET EDIT POST PAGE
// ========================
router.get("/edit/:id", checkAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.render("edit", { 
        error: "Post not found",
        post: null
      });
    }
    
    // Check if user owns this post
    if (post.userId.toString() !== req.userId) {
      return res.render("edit", { 
        error: "You can only edit your own posts",
        post: null
      });
    }
    
    res.render("edit", { 
      post,
      error: null
    });
  } catch (error) {
    console.log(error);
    res.render("edit", { 
      error: "Failed to load post",
      post: null
    });
  }
});

// ========================
// POST UPDATE POST
// ========================
router.post("/update/:id", checkAuth, async (req, res) => {
  try {
    const { caption } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.redirect("/posts/my-posts");
    }
    
    // Check if user owns this post
    if (post.userId.toString() !== req.userId) {
      return res.redirect("/posts");
    }
    
    await Post.findByIdAndUpdate(req.params.id, {
      caption
    });
    
    res.redirect("/posts/my-posts");
  } catch (error) {
    console.log(error);
    res.redirect("/posts");
  }
});

// ========================
// DELETE POST
// ========================
router.delete("/delete/:id", checkAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.json({ success: false, message: "Post not found" });
    }
    
    // Check if user owns this post
    if (post.userId.toString() !== req.userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }
    
    await Post.findByIdAndDelete(req.params.id);
    
    res.json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to delete post" });
  }
});

// ========================
// LIKE POST
// ========================
router.post("/like/:id", checkAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.json({ success: false, message: "Post not found" });
    }
    
    // Check if already liked
    const alreadyLiked = post.likes.includes(req.userId);
    
    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== req.userId);
    } else {
      // Like
      post.likes.push(req.userId);
    }
    
    await post.save();
    
    res.json({ 
      success: true, 
      message: alreadyLiked ? "Unliked" : "Liked",
      liked: !alreadyLiked,
      likeCount: post.likes.length
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to like post" });
  }
});

module.exports = router;
