let user = require('./models/user')
let order = require('./models/order')
let productsfunctions = require('./products-functions')

function createUser(email, password, callback)
{
    user.findOne({"email": email}, function(err, doc){
        if (err)
            return callback(err)
        if(doc == null){
            user.insertMany([{"email": email, "pwd" : password}], function(err, doc){
                return callback(null, 'registered')
            })
        } else {
            return callback(null, 'user_exists')
        }
    })
}

function loginUser(email, password, callback)
{
    user.findOne({"email": email, "pwd" : password}, function(err, doc){
        return callback(err, doc)
    })
}

function findOrCreate(socialId, field, callback)
{ 
    var query = {};
    query[field] = socialId;
    user.findOne(query, function(err, doc){
        if (err) callback(err)
        if (doc){
            callback(null, doc)
        } else {
            user.insertMany(query, (err, doc) => {
                if (err) callback(err)
                callback(null, doc.shift())
            })
        }
    })
}

function findUserByEmail(email, callback)
{
    user.findOne({"email": email}, function(err, doc){
        return callback(err, doc)
    })
}

function findUserById(id, callback)
{
    user.findOne({"_id": id}, function(err, doc){
        return callback(err, doc)
    })
}

function getOrderByUser(emailUser)
{
    return new Promise((resolve, reject) => {
        order.find({"email_user": emailUser}).
        exec(function (err, docs){
            if (err) reject(err)
            console.log(docs)
            resolve(docs)
        })
    })
}

function getProductsOrderByUser(emailUser)
{
    return new Promise((resolve, reject) => {
        order.find({"email_user": emailUser}).populate('product_ref').
        exec(function (err, docs){
            if (err) reject(err)
            console.log(docs)
            resolve(docs.map(o => o.product_ref))
        })
    })
}

module.exports = {
    createUser,
    loginUser,
    findUserByEmail,
    findUserById,
    getOrderByUser,
    getProductsOrderByUser,
    findOrCreate
}