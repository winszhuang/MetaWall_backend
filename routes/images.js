const router = require('../utils/routerWrapper')()
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const { getImage, postImage } = require('../controller/image')

router.get('/:key', getImage)
router.post('/', upload.single('image'), postImage)

module.exports = router.instance;