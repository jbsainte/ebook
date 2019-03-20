const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  product_ref : { type:mongoose.Schema.Types.ObjectId, ref: 'Book' },
  email_user : String,
  order_date : { type : Date, default : Date.now },
  order_price: Number
});

var orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;