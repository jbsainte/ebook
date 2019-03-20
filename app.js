
const express = require('express');
const mongoose = require('mongoose')
let productsfunctions = require('./products-functions.js')
let orderfunctions = require('./orders-functions.js')
let usersfunctions = require('./users-functions')
var bodyParser = require('body-parser');
var session = require('express-session')
var flash = require('connect-flash')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//var moment = require('moment');
//const dialogPolyfill = require('dialog-polyfill')

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'pwd'
    },
    function(username, password, done) {
        usersfunctions.loginUser(username, password, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        return done(null, user);
      });
    }
));

passport.serializeUser(function(user, done) {
    console.log('Serialize : ', user._id)
    done(null, user._id);
  });
  
passport.deserializeUser(function(id, done) {
    usersfunctions.findUserById(id, function(err, user) {
        done(err, user);
    });
});


passport.use(new FacebookStrategy({
    clientID: 782156592157752,
    clientSecret: "871042168fd0aa249c6d1c3ce91ee1e8",
    callbackURL: "/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(profile)
        usersfunctions.findOrCreate( profile.id, "facebook_id", function(err, user) {
            if (err) { return done(err); }
            console.log(user)
            done(null, user);
        });
    }
));

passport.use(new GoogleStrategy({
    clientID: "744858683506-6o1ji43l5runqkdddlooom4jen91nrs5.apps.googleusercontent.com",
    clientSecret: "_CvL6Nun1i1QSN0yy58K3i1n",
    callbackURL: "http://localhost:8080/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile)
    usersfunctions.findOrCreate(profile.id, "google_id", function (err, user) {
        return done(err, user);
    });
  }
));

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
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

/**
 * MIDDLEWARE
 */

app.use(['/order', '/userOrders', '/userProducts'], function (req, res, next) {
    if (req.user) {
       next()
    } else {
        res.status(401).redirect('/login')
    }
});

app.use(['/register'], function (req, res, next) {
    if (!req.user) {
       next()
    } else {
        res.status(301).redirect('/')
    }
});



/**
 * ROUTES USER
 */

app.get('/login', function(req, res) {
    console.log(req.user)
    if (req.user) {
        res.redirect('/')
    } else {
        res.render('login')
    }
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

/*
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
*/


app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

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

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));


app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

/**
 * ROUTES EBOOK
 */

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

app.get('/order', function(req, res) {
    orderfunctions.addOrder(req.query.id, req.user.email)
    .then(orderfunctions.orderProductBydId)
    .then(
        function(result){
            res.send({result : result});
        }
    ).catch((err) => {
        res.status(500).send()
    })
});

app.get('/userOrders', function(req, res) {
    usersfunctions.getOrderByUser(req.user.email)
    .then(
        function(orders){
            //res.render('user_orders', {orders : orders, moment: moment});
            res.send(orders)
        }
    ).catch((err) => {
        res.status(500).send()
    })
});

app.get('/userProducts', async function(req, res) {
    try{
        var orders = await usersfunctions.getProductsOrderByUser(req.user.email)
        await res.send(orders);
    } catch(err){
        console.log(err)
        res.status(500).send()
    }
});

app.get('/buy', function(req, res){
    productsfunctions.getAllBooks(function(err, books){
        if (err){
            console.log(err)
            res.statusCode(500)
            return res.send('Error')
        }
        res.render('buy', {books: books});
    })
})

app.listen(8080);