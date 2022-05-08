const { successHandler, errorHandler } = require('../utils/responseHandler')
const { uploadFile, getFileStream } = require('../store/s3')

function getImage(req, res) {
  if (!req.params.key) {
    errorHandler(res, 404, new Error('no image key'))
  }

  const key = req.params.key
  const readStream = getFileStream(key)

  readStream.pipe(res)
}

async function postImage(req, res) {
  try {
    const file = req.file
    const result = await uploadFile(file)

    successHandler(res, 200, {
      imageUrl: `/images/${result.Key}`
    })
  } catch (error) {
    errorHandler(res, 404, error)
  }
}

module.exports = {
  getImage,
  postImage
}