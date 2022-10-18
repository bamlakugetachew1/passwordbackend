require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passwordsmodel = mongoose.model("passwords");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { response } = require("express");
const router = express.Router();
router.post("/addpassword", verifytoken, async (req, res) => {
  const passswords = new passwordsmodel({
    appname: req.body.appname,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    link: req.body.link,
    owner: req.body.owner,
  });
  await passswords
    .save()
    .then(() => {
      res.json({
        message: "success",
      });
    })
    .catch((error) => {
      res.send(err);
    });
});

router.get("/allpasswords", async (req, res) => {
    passwordsmodel
      .find()
      .then((response) => {
        res.json({
          data: response,
        });
      })
      .catch((error) => {
        res.send(error);
      });
     });

router.get("/passwords", verifytoken, async (req, res) => {
  passwordsmodel
    .find({ owner: req.user.user.email })
    .then((response) => {
      res.json({
        data: response,
      });
    })
    .catch((error) => {
      res.send(error);
    });
});

router.put("/updatepasssword/:id", verifytoken, async (req, res) => {
  const id = req.params.id;
  const passswords = {
    appname: req.body.appname,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    link: req.body.link,
    owner: req.body.owner,
  };
  await passwordsmodel
    .findByIdAndUpdate(id, { $set: passswords })
    .then((response) => {
      res.json({
        message: "newone",
      });
    })
    .catch((error) => {
      res.send(error);
    });
});

router.delete("/deletepassword/:id",verifytoken, async (req, res) => {
  const id = req.params.id;
  await passwordsmodel
    .findByIdAndRemove(id)
    .then(() => {
      res.json({
        message: "password deleted",
      });
    })
    .catch((error) => {
      res.send(error);
    });
});

function verifytoken(req, res, next) {
  const token = req.headers["authorization"];
  const divide = token && token.split(" ")[1];
  if (!divide) {
    res.json({
      message: "we diddnt get a token",
    });
  } else {
    jwt.verify(divide, process.env.SecretToken, (err, user) => {
      if (err) {
        res.send(err);
      } else {
        req.user = user;
        next();
      }
    });
  }
}
module.exports = router;
