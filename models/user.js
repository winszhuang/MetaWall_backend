const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, '請輸入您的名字']
    },
    email: {
      type: String,
      required: [true, '請輸入您的 Email'],
      unique: true,
      lowercase: true,
      select: false
    },
    password: {
      type: String,
      required: [true, '請輸入您的 Password'],
      select: false
    },
    gender: {
      type: Number,
      required: [true, '請輸入']
    },
    avator: {
      type: String
    },
    createdAt: {
      type: Date,
      required: [true, ''],
      default: Date.now,
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user",
      default: []
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "post",
      default: []
    }
  });

const User = mongoose.model('user', userSchema);

module.exports = User;