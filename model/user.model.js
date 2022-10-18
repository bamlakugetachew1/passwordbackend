const mongoose = require("mongoose");
const databaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password:{
     type:String,
     require:true
  }
},
 {timestamps:true}
);
mongoose.model("users", databaseSchema);
