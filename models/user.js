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
  avator: {
    type: String,
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
  following: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  followers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
}, { versionKey: false });

const User = mongoose.model('user', userSchema);

module.exports = User;
