const methodList = ['get', 'post', 'put', 'delete', 'patch', 'options'];

module.exports = () => {
  // 需要在導入某檔案時才載入express，不然會有非預期問題
  const express = require('express');
  const router = express.Router();

  /**
   * 重新包裝過的router，可使用router所有http method。
   * 在路由檔案導出 : module.exports = router.instance
   */
  const routerWrapper = {
    instance: router,
  };

  // 為routerWrapper註冊每個method
  methodList.forEach((method) => {
    routerWrapper[method] = wrappingMethod(method);
  });

  function wrappingMethod(method) {
    return (...theArgs) => {
      // 參數只有一個的情況，和express預設一樣
      if (theArgs.length === 1) {
        return router[method](...theArgs);
      }

      const handler = theArgs.pop();
      // 自定義req res function使用前，先包一層來catch錯誤
      return router[method](...theArgs, handleErrorAsync(handler));
    };
  }

  return routerWrapper;
};

function handleErrorAsync(handler) {
  return (req, res, next) => {
    handler(req, res, next).catch((error) => {
      next(error);
    });
  };
}
