require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const bodyparser = require("body-parser");
const connection = require("./model/connection");
const usercontrollers = require("./controllers/usercntroller");
const passwordcontrollers = require("./controllers/passwordcontroller");
const app = express();
app.use(cors());
app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(bodyparser.json());
app.use(express.json());
app.use(helmet());
app.use(morgan());
app.use('/users',usercontrollers);
app.use('/passwords',passwordcontrollers);
app.listen(process.env.PORT || 3000, (req,res) => {
   res.send("home page");
  console.log("app listing on port 3000");
  
});
