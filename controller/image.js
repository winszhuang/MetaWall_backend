const { Readable } = require('stream');
const { uploadFile, getFileAsync } = require('../store/s3');
const successHandler = require('../utils/successHandler');
const appError = require('../utils/appError');
const RequestBlocker = require('../services/blocker/RequestBlocker');
const {
  isFileExist,
  isFieldNameImage,
  isImageType,
  isFileSizeLessThan1MB,
  isImageWidthGreaterThan300,
  isImage1And1Ratio,
} = require('../services/blocker/rule/image-rule');

async function getImage(req, res, next) {
  if (!req.params.key) return appError('400', 'fetch image requires a key!!', next);

  const { key } = req.params;
  if (!key) return appError('400', 'key required!!', next);

  const buffer = (await getFileAsync(key)).Body;

  return Readable.from(buffer).pipe(res);
}

async function postImage(req, res, next) {
  const errorData = new RequestBlocker(req)
    .setBlocker(
      isFileExist,
      isFieldNameImage,
      isImageType,
      isFileSizeLessThan1MB,
      isImageWidthGreaterThan300,
      isImage1And1Ratio,
    ).getErrorData();

  if (errorData) {
    const { statusCode, errorMessage } = errorData;
    return appError(statusCode, errorMessage, next);
  }

  const result = await uploadFile(req.file);
  return successHandler(res, 200, {
    imageUrl: `/images/${result.Key}`,
  });
}

module.exports = {
  getImage,
  postImage,
};
