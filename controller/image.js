const successHandler = require('../utils/successHandler')
const { uploadFile, getFileAsync } = require('../store/s3')
const appError = require('../utils/appError')
const { Readable } = require('stream')

async function getImage(req, res, next) {
  if (!req.params.key) return appError('404', 'fetch image requires a key!!', next)

  const key = req.params.key
  const buffer = (await getFileAsync(key)).Body

  Readable.from(buffer).pipe(res)
}

async function postImage(req, res) {
  const file = req.file
  const result = await uploadFile(file)

  successHandler(res, 200, {
    imageUrl: `/images/${result.Key}`
  })
}

module.exports = {
  getImage,
  postImage
}