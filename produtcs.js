var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog', function(err) {
  if (err) { throw err; }
})


var products = new mongoose.Schema({
    id : String,
    name : String,
    USD_price: Number,
    EUR_price: Number,
    file_link: String,
    creation_date : { type : Date, default : Date.now },
    orders_counter: Integer
  });