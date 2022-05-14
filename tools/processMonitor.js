process.on('uncaughtException', (err) => {
  console.log('---------------');
  console.error('Uncaughted Exception！');
  console.error(err);
  process.exit(1);
});

process.on('unhandledRejection', (err, promise) => {
  console.error('沒有catch：', promise, '原因：', err);
});
