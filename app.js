require('./tools/processMonitor');
require('dotenv').config({ path: './config.env' });

const express = require('express');
const path = require('path');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');
const appError = require('./utils/appError');

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
app.use((req, res, next) => {
  appError(404, 'route does not exist', next);
});

// custom middleware
app.use(errorHandler);

module.exports = app;
