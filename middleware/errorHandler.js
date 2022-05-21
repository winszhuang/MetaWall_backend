// 彩雷注意!! 該function最後一個參數不加上next，error就不會到這處理...
// eslint-disable-next-line consistent-return
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'dev') return errorHandleInDev(err, res);
  if (process.env.NODE_ENV === 'pro') return errorHandleInPro(err, res);

  return errorHandleInPro(err, res);
}

function errorHandleInDev(error, res) {
  res.status(error.statusCode).json({
    status: 'error',
    message: error.message,
    stack: error.stack,
  });
}

function errorHandleInPro(error, res) {
  if (error.name === 'SyntaxError') {
    error.isOperational = true;
    error.message = '語法錯誤';
  }

  // 處理mongoose schema驗證錯誤的資訊
  if (error.name === 'ValidationError') {
    error.isOperational = true;
    error.message = '欄位未填寫正確，請重新輸入!!';
  }

  // 處理mongoose在資料庫找不到該id
  if (error.message?.includes('Cast to ObjectId failed for value')) {
    error.isOperational = true;
    error.name = 'non-existing id';
    error.message = '無此id';
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
