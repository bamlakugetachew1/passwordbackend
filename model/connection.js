require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.Mongourl,(error)=>{ 
 if(!error){
    console.log('database is connecetd');
 }
});
const users = require('./user.model')
const passwords  = require('./passwords.model')
