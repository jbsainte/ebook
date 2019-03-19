let fs = require('fs')
let bookModel = require('./models/book')

function orderProductBydId(id, callback){
    bookModel.updateOne({"id": id}, { $inc: { "orders_counter": 1}}, function(err, row){
        if (err) return console.log(err);
        bookModel.findOne({"id": id}, function(err, doc){
            if (err) return console.log(err);
            return callback(null, `Commande terminée. Voici votre fichier :[${doc.file_link}]`)
        })
        
    })
}

module.exports.orderProductBydId = orderProductBydId;