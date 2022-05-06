function successHandler(res, statusCode, data) {
  res.status(statusCode).json({
    status: "success",
    data: data
  })
}

function errorHandler(res, statusCode, error) {
  res.status(statusCode).json({
    status: "fail",
    message: error.message
  })
}

module.exports = {
  successHandler,
  errorHandler
}