const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Content 未填寫']
    },
    image: {
      type: String,
      default: ""
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user",
      required: [true, 'need number'],
      default: []
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, '貼文姓名未填寫']
    }

  }
);
const Post = mongoose.model('Post', postSchema);

module.exports = Post;