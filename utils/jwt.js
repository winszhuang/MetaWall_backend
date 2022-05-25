const jwt = require('jsonwebtoken');

function generateJWT(user) {
  return jwt.sign(
    // eslint-disable-next-line no-underscore-dangle
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_DAY },
  );
}

function verifyJWT(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        reject(error);
      } else {
        resolve(decoded);
      }
    });
  });
}

module.exports = {
  generateJWT,
  verifyJWT,
};
