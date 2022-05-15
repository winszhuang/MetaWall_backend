const sizeOf = require('image-size');
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

  // 後續圖片上傳的規則可以繼續擴充
  const { minWidth, ratio } = req.body;

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
    return appError(404, 'file must be less than 1MB', next);
  }

  const { width, height } = sizeOf(file.path);
  // 如果上傳圖片有限制最小寬度的情況
  if (minWidth && width < minWidth) {
    return appError(404, `image width must be greater than ${minWidth} `, next);
  }

  // 如果上傳圖片有限制寬高比的情況
  if (ratio) {
    if (!ratio.includes(':')) {
      return appError(404, '錯誤的長寬比格式', next);
    }
    const ratioArray = ratio.split(':');
    if (ratioArray.length !== 2) return appError(404, '錯誤的長寬比格式', next);
    const radioOfWidth = ratioArray[0];
    const radioOfHeight = ratioArray[1];

    if (!radioOfWidth
      || !radioOfHeight
      || radioOfWidth === '0'
      || radioOfHeight === '0'
    ) {
      return appError(404, '錯誤的長寬比格式', next);
    }

    if (width / height !== Number(radioOfWidth) / Number(radioOfHeight)) {
      return appError(404, '長寬比不匹配', next);
    }
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
