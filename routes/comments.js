const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const BlogPost = require("../models/BlogPost");
const mongoose = require("mongoose");

// CREATE a new comment
router.post("/", async (req, res) => {
  try {
    const { commenterName, blogPostId, content, blogPostSlug } = req.body;
    const blogPost = await BlogPost.findById(blogPostId);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    console.log(req.body.blogPostId);
    console.log(req.body.commenterName);
    const comment = new Comment({
      commenterName,
      blogPostId: new mongoose.Types.ObjectId(blogPostId),
      commentText: content,
    });
    await comment.save();
    res.redirect(`/blogs/${blogPostSlug}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// READ all comments for a blog post
router.get("/:blogPostId", async (req, res) => {
  try {
    const { blogPostId } = req.params;
    const comments = await Comment.find({ blogPostId });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE a comment
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.commenterName !== req.user.username) {
      return res.status(403).json({ message: "Forbidden" });
    }
    comment.content = content;
    await comment.save();
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a comment
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.commenterName !== req.body.commenterName) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await Comment.findByIdAndDelete(id);
    res.redirect(`/blogs/${req.body.blogPostSlug}`)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
