const express = require('express');
const router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const { getImage, postImage } = require('../controller/image')

router.get('/:key', getImage)
router.post('/', upload.single('image'), postImage)

module.exports = router;