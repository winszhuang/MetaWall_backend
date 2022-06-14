const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '請輸入您的名字'],
  },
  email: {
    type: String,
    required: [true, '請輸入您的 Email'],
    unique: true,
    lowercase: true,
    select: false,
  },
  password: {
    type: String,
    required: [true, '請輸入您的 Password'],
    select: false,
  },
  gender: {
    type: Number,
    required: [true, '請輸入'],
  },
  avatar: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  following: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
      followedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  followers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
      followedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, { versionKey: false });

const User = mongoose.model('user', userSchema);

module.exports = User;
