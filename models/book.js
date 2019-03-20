const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  name : String,
  description: String,
  USD_price: Number,
  EUR_price: Number,
  file_link: String,
  creation_date : { type : Date, default : Date.now },
  orders_counter: Number
});

var bookModel = mongoose.model('Book', bookSchema);

module.exports = bookModel;