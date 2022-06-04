const appError = require('../utils/appError');
const { verifyJWT } = require('../utils/jwt');

async function isAuth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) return appError(400, '沒有簽證!!', next);

  if (!authorization.startsWith('Bearer')) {
    return appError(400, 'need Bearer prefix', next);
  }

  const token = authorization.split('Bearer')[1].trim();
  if (!token) return appError(403, '沒有權限', next);

  return verifyJWT(token)
    .then((data) => {
      req.user = { _id: data.id };
      next();
    })
    .catch(() => {
      appError(403, '簽證錯誤', next);
    });
}

module.exports = isAuth;
