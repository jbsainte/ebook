
var express = require('express');
let productsfunctions = require('./products-functions.js')
let orderfunctions = require('./orders-functions.js')
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog', function(err) {
  if (err) { throw err; }
})

var app = express();
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


app.get('/', function(req, res) {
    productsfunctions.getAllProducts(function(err, products){
        if (err){
            
        }
        res.render('index', {listingProducts: products});
    })
});

app.get('/order', function(req, res) {
    orderfunctions.orderProductBydId(req.query.id, function(err, result){
        if (err){ 
        }
        res.send({result : result});
    })
});



app.listen(8080);