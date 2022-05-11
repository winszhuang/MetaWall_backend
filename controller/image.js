const { successHandler, errorHandler } = require('../utils/responseHandler')
const { uploadFile, getFileStream } = require('../store/s3')
const { Readable } = require('stream')

async function getImage(req, res) {
  if (!req.params.key) {
    errorHandler(res, 404, new Error('no image key'))
  }

  const key = req.params.key
  try {
    const buffer = (await getFileStream(key)).Body
    Readable.from(buffer).pipe(res)
  } catch (error) {
    errorHandler(res, 404, error)
  }
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