
const express = require('express');
const mongoose = require('mongoose')
let productsfunctions = require('./products-functions.js')
let orderfunctions = require('./orders-functions.js')
let usersfunctions = require('./users-functions')
var bodyParser = require('body-parser');
var session = require('express-session')

mongoose
.connection
.on('connected', function() {
    console.log('Mongoose default connection open to db')
})

mongoose
.connection
.on('error', function(err) {
    console.log('Mongoose default connection error :', err)
})

mongoose.connect('mongodb://localhost:27017/ebook', function(err) {
    if (err) { throw err; }
  })


const app = express();
app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    productsfunctions.getAllBooks(function(err, books){
        if (err){
            console.log(err)
            res.statusCode(500)
            return res.send('Error')
        }
        res.render('index', {books: books});
    })
});

app.use('/order', function (req, res, next) {
    sess = req.session;
    if (sess.email) {
       next()
    } else {
        res.send('not_logged')
    }
});

app.get('/order', function(req, res) {
    orderfunctions.orderProductBydId(req.query.id, function(err, result){
        if (err){ 
        }
        res.send({result : result});
    })
});

app.get('/login', function(req, res) {
    sess = req.session;
    if (sess.email) {
        res.redirect('/')
    } else {
        res.render('login')
    }
});

app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    })
});

app.post('/login', function(req, res) {
    if (typeof req.body.email !== 'undefined' && typeof req.body.pwd !== 'undefined'){
        usersfunctions.loginUser(req.body.email, req.body.pwd, function(err, user){
            if (err){
                console.log(err)
                res.statusCode(500)
                return res.send('Error')
            }
            if(user != null) {
                sess = req.session;
                sess.email = req.body.email;
                res.redirect('/')
            } else {
                res.render('login', {error: 'Error login'})
            }
        })
    } else {
        res.statusCode(500)
        return res.send('Error missing parameters')
    }
});

app.get('/register', function(req, res) {
    res.render('register')
})

app.post('/register', function(req, res) {
    if (typeof req.body.email !== 'undefined' && typeof req.body.pwd !== 'undefined'){
        console.log('Email :', req.body.email)
        console.log('Email :', req.body.pwd)
        usersfunctions.createUser(req.body.email, req.body.pwd, function(err, tplName){
            if (err){
                console.log(err)
                res.statusCode(500)
                return res.send('Error')
            }
            console.log('tplName', tplName)
            return res.render(tplName)
        })
    }
    else {
        res.statusCode(500)
        return res.send('Error missing parameters')
    }
});

app.listen(8080);