require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const firstmodel = mongoose.model("users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
router.get("/firstget", (req, res) => {
  //   firstmodel.find((err, docs) => {
  //     if (!err) {
  //       res.send(docs);
  //     }
  //   });
  firstmodel
    .find()
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.send(error);
    });
});


router.post("/login",  (req, res) => {
  const name = req.body.name;
  const age = req.body.age;

  const user = {
    name:name,
    age:age,
  };
  // user.name=name;
  // user.age=age;
   const refershtoken = jwt.sign({user:user},process.env.SecretRefres,{expiresIn:'1d'});
   jwt.sign({ user: user }, process.env.SecretToken,{expiresIn:'1d'}, (err, token) => {
    if (err) {
      res.json({
        message: "error in creating tokens",
      });
    } else {
      res.json({
        token: token,
        refershtoken:refershtoken
      });
    }
  });
});

router.get("/loginas",verifytoken,(req,res)=>{
       
      res.json({
            message:"you logged as",
            name:req.user.user.name
      })
        

})

router.post("/login1",verifytoken, (req, res) => {
  const name = req.body.name;
  const age = req.body.age;
  const user = {
    name: name,
    age: age,
  };
  jwt.sign({ user: user }, process.env.SecretToken, (err, token) => {
    if (err) {
      res.json({
        message: "error in creating tokens",
      });
    } else {
      res.json({
        token: token,
      });
    }
  });
});

router.post('/refresh',(req,res)=>{
  const refreshtoken  = req.body.refershtoken;
  jwt.verify(refreshtoken,process.env.SecretRefres,(err,user)=>{
         if(err){
          res.json({
            message:"inavalied refresh token"
          })
         }
         else{
          const token = jwt.sign({user:user},process.env.SecretToken,{expiresIn:'50s'});
           res.json({
            token:token
           })}
  })
})


function verifytoken(req, res, next) {
  const token = req.headers['authorization'];
  const divide = token && token.split(' ')[1];
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

router.post("/firstpost", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashage = await bcrypt.hash(req.body.age,salt);
  let data = new firstmodel({
    name: req.body.name,
    age: hashage,
  });

  data
    .save()
    .then((response) => {
      res.json({
        message: "data saved",
      });
    })
    .catch((error) => {
      res.json({
        message: "error",
      });
    });
});

router.put("/update", (req, res) => {
  let id = req.body.id;
  let newdata = {
    name: req.body.name,
    age: req.body.age,
  };
  firstmodel
    .findByIdAndUpdate(id, { $set: newdata })
    .then((respone) => {
      res.json({
        message: "data saved updated",
      });
    })
    .catch((error) => {
      res.json({
        message: "error",
      });
    });
});
 
router.post("/checkuser",async(req,res)=>{   
 
  const user = await firstmodel.findOne({name:req.body.name});
        if(user.length==0){
          res.send("not found");
        }
    
const validate =  await bcrypt.compare(req.body.age,user.age)
        console.log(validate)
        
})    

router.delete("/delete", (req, res) => {
  let id = req.body.id;
  firstmodel
    .findByIdAndRemove(id)
    .then((response) => {
      res.json({
        message: "data deleted",
      });
    })
    .catch((error) => {
      res.json({
        message: "error",
      });
    });
});

// router.post("/firstpost", (req, res) => {
//   const data = new firstmodel();
//   data.name = req.body.name;
//   data.age = req.body.age;
//   data.save();
// });

module.exports = router;
