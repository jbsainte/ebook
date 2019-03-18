let fs = require('fs')


fs.readFile(`${__dirname}/products.json`, 'utf8', (err,file) => {
    if (err) {
        console.log("Error on reading file");
        return false;
    }

    try{
        let content = JSON.parse(file);

        Object.keys(content.products).forEach(function(key){
            //console.log(key, content.products[key]);
            Object.keys(content.products[key]).forEach(function(keybis){
                console.log(keybis, content.products[key][keybis])
            });
            for(prop in content.products[key]) {
                if(!content.products[key].hasOwnProperty(prop)) continue;
            
                console.log(prop + " - "+ content.products[key][prop]);
            }
        });
    } catch(e){
        console.log(e);
    }
});
