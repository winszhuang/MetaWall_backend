// eslint-disable-next-line consistent-return
function errorHandler(err, req, res) {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'dev') return errorHandleInDev(err, res);
  if (process.env.NODE_ENV === 'pro') return errorHandleInPro(err, res);

  errorHandleInPro(err, res);
}

function errorHandleInDev(error, res) {
  res.status(error.statusCode).json({
    status: 'error',
    message: error.message,
    stack: error.stack,
  });
}

function errorHandleInPro(error, res) {
  if (error.name === 'ValidationError') {
    // 處理mongoose schema驗證錯誤的資訊
    error.isOperational = true;
    error.message = '欄位未填寫正確，請重新輸入!!';
  }

  // aws s3存取有問題
  if (error.name === 'AccessDenied') {
    error.isOperational = true;
    error.message = '向雲端存取圖片有問題，請確認key正確!!';
  }

  res.status(error.statusCode).json({
    status: 'error',
    message: error.isOperational ? error.message : '系統錯誤，請諮詢系統管理員',
  });
}

module.exports = errorHandler;
