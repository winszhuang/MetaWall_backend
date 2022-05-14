function appError(statusCode, errorMessage, next) {
  const error = new Error(errorMessage)
  error.statusCode = statusCode
  error.isOperational = true
  next(error)
}

module.exports = appError