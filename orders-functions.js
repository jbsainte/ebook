let fs = require('fs')
let bookModel = require('./models/book')
let orderModel = require('./models/order')

function orderProductBydId(id){
    return new Promise((resolve, reject) => {
        bookModel.updateOne({"_id": id}, { $inc: { "orders_counter": 1}}, function(err, row){
            if (err) return reject(err);
            bookModel.findOne({"_id": id}, function(err, doc){
                if (err) return reject(err);
                return resolve(`Commande terminée. Voici votre fichier :[${doc.file_link}]`)
            })
        })
    })
   
}

function addOrder(id, userEmail){
    return new Promise((resolve, reject) => {
        bookModel.findOne({"_id": id}, function(err, doc){
            if (err) reject('Not Found book to order')
            resolve(doc) 
        })
    }).then(function whenOK(book) {
        return new Promise((resolve, reject) => {
            orderModel.insertMany([{
                "product_ref": book.id,
                "email_user" : userEmail,
                "order_price": book.EUR_price
            }], function(err, doc){
                if (err) reject('Not Found book to order')
                resolve(id) 
            })
        })
    }).catch(function notOK(err){
        console.error(err)
    })
}

module.exports.orderProductBydId = orderProductBydId;
module.exports.addOrder = addOrder;