function successHandler(res, message, data, statusCode = 200) {
  res.status(statusCode).json({
    message,
    status: 'success',
    data,
  });
}

module.exports = successHandler;
