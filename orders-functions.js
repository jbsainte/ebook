let fs = require('fs')

function orderProductBydId(id, callback){
    let filepath = `${__dirname}/products.json`;
    fs.readFile(filepath, 'utf8', (err,file) => {
        let content = JSON.parse(file);
        let urlFile = '';
        /*Object.keys(content.products).forEach(function(key){
            if (content.products[key].hasOwnProperty('id') && 
            content.products[key]['id'] == id) {
                content.products[key]['orders_counter'] = content.products[key]['orders_counter'] + 1;
                urlFile = content.products[key]['file_link'];
            }
        })*/
        //console.log(id)
        content.products.some(function (value, index, _arr) {
            if (value.hasOwnProperty('id') && 
            value['id'] == id) {
                content.products[index]['orders_counter'] = value['orders_counter'] + 1;
                urlFile = content.products[index]['file_link'];
                return true;
            }
        });
        if (urlFile == ''){
            return callback('Not existing ID')
        }
        //console.log(JSON.stringify(content));
        fs.writeFile(filepath, JSON.stringify(content, null, 4), function (err) {
            if (err) return console.log(err);
            return callback(null, `Commande terminée. Voici votre fichier :[${urlFile}]`)
        })

        return false
    })
}

module.exports.orderProductBydId = orderProductBydId;