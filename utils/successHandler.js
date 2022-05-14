function successHandler(res, statusCode, data) {
  res.status(statusCode).json({
    status: "success",
    data: data
  })
}

module.exports = successHandler