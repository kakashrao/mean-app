const Post = require("../models/post");
const express = require("express");

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

router.post("", checkAuth, multer({storage: storage}).single('image') ,(req, res) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Post added successfully",
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Creating a post failed'
    })
  })
});

router.put("/:id", checkAuth , multer({storage: storage}).single('image'), (req, res) => {
  let imagePath = req.body.imagePath;
  if(req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });

  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then((result) => {
    if(result.modifiedCount > 0) {
      res.status(200).json({
        message: "Post updated successfully",
      });
    } else {
      res.status(401).json({
        message: "Not authorized!!",
      });
    }

  })
  .catch(error => {
    res.status(500).json({
      message: "Couldn't update post"
    })
  })
});

router.get("", (req, res, next) => {
  const pageSize = +req.params.pageSize;
  const currentPage = +req.params.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if(pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      // console.log(documents)
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching post failed'
      })
    })
});

router.get("/:id", (req, res) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: "Post not found",
      });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Fetching post failed'
    })
  })
});

router.delete("/:id", (req, res, next) => {
  // console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then((result) => {
    if(result.deletedCount > 0) {
      res.status(200).json({
        message: "Post deleted successfully",
      });
    } else {
      res.status(401).json({
        message: "Not authorized!!",
      });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Fetching post failed'
    })
  })
});

module.exports = router;
