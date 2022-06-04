const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Content 未填寫'],
  },
  image: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    required: [true, 'need number'],
    default: [],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, '貼文姓名未填寫'],
  },
}, {
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  id: false,
});

postSchema.virtual('comments', {
  ref: 'comment',
  foreignField: 'post',
  localField: '_id',
});

const Post = mongoose.model('post', postSchema);

module.exports = Post;
