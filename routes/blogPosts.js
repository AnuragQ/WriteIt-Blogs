const express = require("express");
const BlogPost = require("../models/BlogPost");
const router = express.Router();
const Comment = require("../models/Comment");
const id = require("faker/lib/locales/id_ID");

router.get("/create", (req, res) => {
  res.render("blogs/create", { blogPost: new BlogPost() });
});
router.get("/edit/:id", async (req, res) => {
  const blogPost = await BlogPost.findById(req.params.id);

  res.render("blogs/edit", { blogPost: blogPost });
});
router.get("/:slug", async (req, res) => {
  const blogPost = await BlogPost.findOne({ slug: req.params.slug });
  if (blogPost == null) res.redirect("/");
  //   fetch comments
  const comments = await Comment.find({ blogPostId: blogPost._id });
  res.render("blogs/show", { blogPost: blogPost, comments: comments });
});
router.post("/", async (req, res) => {
  let username = "";
  if (global.user != null) username = global.user.username;
  else if (req.body.author != null) username = req.body.author;
  else username = "Anonymous";

  let blogPost = new BlogPost({
    title: req.body.title,
    content: req.body.content,
    author: username,
    createdAt: new Date(),
  });
  try {
    blogPost = await blogPost.save();
    res.redirect(`/blogs/${blogPost.slug}`);
  } catch (err) {
    console.log(err);
    res.render("blogs/create", { blogPost: blogPost });
  }
});

router.put("/:id", async (req, res) => {
  let blogPost = await BlogPost.findById(req.params.id);
  blogPost.title = req.body.title;
  blogPost.content = req.body.content;
  if (global.user != null) blogPost.author = global.user.username;
  else if (req.body.author != null) blogPost.author = req.body.author;
  else blogPost.author = "Anonymous";
  blogPost.createdAt = new Date();

  try {
    blogPost = await blogPost.save();
    res.redirect(`/blogs/${blogPost.slug}`);
  } catch (err) {
    console.log(err);
    res.render("blogs/edit", { blogPost: blogPost });
  }
});

router.delete("/:id", async (req, res) => {
  await BlogPost.findByIdAndDelete(req.params.id);
  res.redirect("/");
});
module.exports = router;
