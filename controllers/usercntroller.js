require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const usermodel = mongoose.model("users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashpasswords = await bcrypt.hash(req.body.password, salt);
  const ifound = await usermodel.findOne({ email: req.body.email });
  if (ifound != null) {
    res.json({
      message: "alerady registred please log in",
    });
  } else {
    const user = new usermodel({
      name: req.body.name,
      email: req.body.email,
      password: hashpasswords,
    });
    await user
      .save()
      .then(() => {
        res.json({
          message: "succesully registred",
          success: true,
        });
      })
      .catch((error) => {
        res.json({
          status: error,
          message: "something wrong please try again",
        });
      });
  }
});

router.post("/login", async (req, res) => {
  const user = await usermodel.findOne({ email: req.body.email });
  if (user != null) {
    const validate = await bcrypt.compare(req.body.password, user.password);
    if (validate) {
      jwt.sign(
        { user: user },
        process.env.SecretToken,
        { expiresIn: "1d" },
        (err, token) => {
          if (err) {
            res.json({
              message: "error in creating tokens",
            });
          } else {
            res.json({
              token: token,
              success: true,
              email: req.body.email,
            });
          }
        }
      );
    } else {
      res.json({
        message: "your passswords are incorrect",
      });
    }
  } else {
    res.json({
      message: "you are not registred please sign up",
    });
  }
});

module.exports = router;
