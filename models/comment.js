const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post',
    required: [true, 'required a specific post'],
  },
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'user required'],
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
}, { versionKey: false });

// eslint-disable-next-line func-names
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name _id avatar',
  });

  next();
});

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;
