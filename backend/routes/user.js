const express = require("express");
const bcrypt = require("bcrypt");
const user = require("../models/user");

const router = express.Router();

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
        .then(hash => {
          const user = new user({
            email: req.body.email,
            password: hash
          })
          user.save()
              .then((result) => {
                res.status(201).json({
                  message: "User created successfully",
                  result: result
                })
              })
              .catch((err) => {
                res.status(500).json({
                  message: err
                })
              })
        })
})

module.exports = router;
