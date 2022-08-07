const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const jwt = require("jsonwebtoken");

const router = express.Router();

router.post('/signup', (req, res, next) => {
  console.log(req.body);
  bcrypt.hash(req.body.password, 10)
        .then(hash => {
          const user = new User({
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

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
      .then((user) => {
        if(!user) {
          return res.status(401).json({
            messsage: "User not exist, please signup"
          })
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password)
      })
      .then((result) => {
        if(!result) {
          res.status(401).json({
            message: "Auth Failed"
          })
        }

        const token = jwt.sign(
          { email: fetchedUser.email, userId: fetchedUser._id},
          "secret_this.should_be_longer",
          {
            expiresIn: "1h"
          }
        )

        res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: fetchedUser._id
        })
      })
      .catch((err) => {
        res.status(401).json({
          message: "Auth Failed"
        })
      })
})

module.exports = router;
