const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  commenterName: {
    type: String,
    required: true,
  },
  commentText: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  blogPostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BlogPost",
    required: true,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
