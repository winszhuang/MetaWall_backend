const { Readable } = require('stream');
const { uploadFile, getFileAsync } = require('../store/s3');
const successHandler = require('../utils/successHandler');
const appError = require('../utils/appError');

async function getImage(req, res, next) {
  if (!req.params.key) return appError('404', 'fetch image requires a key!!', next);

  const { key } = req.params;
  if (!key) return appError('404', 'key required!!', next);

  const buffer = (await getFileAsync(key)).Body;

  return Readable.from(buffer).pipe(res);
}

async function postImage(req, res, next) {
  const { file } = req;
  if (!file) return appError('404', 'file required!!', next);

  const result = await uploadFile(file);

  return successHandler(res, 200, {
    imageUrl: `/images/${result.Key}`,
  });
}

module.exports = {
  getImage,
  postImage,
};
