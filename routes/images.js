const multer = require('multer');
const router = require('../utils/routerWrapper')();
const isAuth = require('../middleware/isAuth');

const upload = multer({ dest: 'uploads/' });
const { getImage, postImage } = require('../controller/image');

router.get('/:key', isAuth, getImage);
router.post('/', isAuth, upload.single('image'), postImage);

module.exports = router.instance;
