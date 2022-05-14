const express = require('express');
const path = require('path');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const imagesRouter = require('./routes/images');

mongoose.connect(`mongodb+srv://wins:${process.env.MONGO_PASSWORD}@livewall.q6ypt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
  .then(() => {
    console.log('connect to mongo');
  })
  .catch((error) => {
    console.error(error);
  });

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/images', imagesRouter);
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: '無此路由'
  });
});

module.exports = app;
