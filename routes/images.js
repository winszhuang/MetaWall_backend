const express = require('express');
const router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const { getImage, postImage } = require('../controller/image')


/**
 * GET /images/:id
 * @summary 取得對應id的圖片
 * @tags images
 */

router.get('/:key', getImage)


/**
 * POST /images
 * @summary 上傳新的圖片
 * @tags images
 * @param  - multipart/form-data
 * @return {postImageRes} 200 - success response - application/json
 */

router.post('/', upload.single('image'), postImage)




module.exports = router;