const mongoose = require("mongoose");
const databaseSchema = new mongoose.Schema({
  appname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email:{
     type:String,
     require:true
  },
   password:{
     type:String,
     require:true
    },
   link:{
    type:String,
    require:true
  },
   owner:{
    type:String,
    require:true
  }
},
 {timestamps:true}
);
mongoose.model("passwords", databaseSchema);