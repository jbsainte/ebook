const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email : String,
  pwd : String,
  facebook_id: Number,
  google_id: Number
});

var userModel = mongoose.model('User', userSchema);

module.exports = userModel;