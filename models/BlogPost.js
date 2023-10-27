const mongoose = require("mongoose");
const marked = require("marked");
const slugify = require("slugify");
const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  author: {
    //object id of the author
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
});

blogPostSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }
  next();
});
 
const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = BlogPost;