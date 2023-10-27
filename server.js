const express = require("express");
const mongoose = require("mongoose");
const BlogPost = require("./models/BlogPost");
const UserRouter = require("./routes/users");
const methodOverride = require("method-override");
const blogPostsRouter = require("./routes/blogPosts");
const AuthRouter = require("./routes/auth");
const CommentRoute = require("./routes/comments");
const app = express();
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/writeit",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.get("/", async function (req, res) {
  const blogPosts = await BlogPost.find().sort({ createdAt: "desc" });
  res.render("blogs/index", { blogPosts: blogPosts });
});

app.use("/user", UserRouter);
app.use("/auth", AuthRouter);
app.use("/blogs", blogPostsRouter);
app.use("/comments", CommentRoute);
app.listen(3000, function () {
  console.log("listening on 3000");
});
