let fs = require('fs')

function getAllProductsDisplay(){
    fs.readFile(`${__dirname}/products.json`, 'utf8', (err,file) => {
        if (err) {
            console.log("Error on reading file");
            return false;
        }

        try{
            let content = JSON.parse(file);
            let listing = `Bienvenue. Voici les produits disponibles : 
`;
            Object.keys(content.products).forEach(function(key){
                //console.log(key, content.products[key]);
                /*Object.keys(content.products[key]).forEach(function(keybis){
                    console.log(keybis, content.products[key][keybis])
                });*/
                
                if (content.products[key].hasOwnProperty('id') && 
                content.products[key].hasOwnProperty('name') &&
                content.products[key].hasOwnProperty('EUR_price') &&
                content.products[key].hasOwnProperty('orders_counter')
                ) {
                    listing += `    - ` + content.products[key]['id'] + ' - '  + 
                    content.products[key]['name'] + ' / ' + 
                    content.products[key]['EUR_price'] + ' / ' + 
                    content.products[key]['orders_counter'] + `
`
                }
               
                
            });
            console.log(listing)
        } catch(e){
            console.log(e);
        }
    });
}

function getAllProducts(callback){
    fs.readFile(`${__dirname}/products.json`, 'utf8', (err,file) => {
        if (err) {
            console.log("Error on reading file");
            return callback(null)
        }

        try{
            let content = JSON.parse(file);
            return callback(null, content.products)
        } catch(e){
            return callback(e)
        }
    });
}

module.exports.getAllProducts = getAllProducts;