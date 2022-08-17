const express = require("express");

const postController = require('../controllers/posts');

const multer = require('multer');
const checkAuth = require('../middleware/check-auth')

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    const error = new Error('Invalid mime type');
    cb(isValid ? null : error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
})

router.post("", checkAuth, multer({storage: storage}).single('image') , postController.createPost);

router.put("/:id", checkAuth , multer({storage: storage}).single('image'), postController.updatePost);

router.get("", postController.getPosts);

router.get("/:id", postController.getPost);

router.delete("/:id", postController.deletePost);

module.exports = router;
