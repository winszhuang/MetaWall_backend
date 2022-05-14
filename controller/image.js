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

  if (file.fieldname !== 'image') {
    return appError('404', 'field key of form should be called "image"!!', next);
  }

  if (!file.mimetype.startsWith('image')) {
    return appError('404', 'file should be image type!!', next);
  }
  // 檔案呈現是位元單位，
  const mb = 1024 * 1024;
  if (file.size > mb) {
    return appError('404', 'file must be less than 1MB', next);
  }

  const result = await uploadFile(file);

  return successHandler(res, 200, {
    imageUrl: `/images/${result.Key}`,
  });
}

module.exports = {
  getImage,
  postImage,
};
