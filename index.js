let productsfunctions = require('./products-functions.js')
let ordersfunctions = require('./orders-functions.js')
var readline = require('readline');

productsfunctions.getAllProducts();

var rl = readline.createInterface({input: process.stdin, output: process.stdout, terminal: false});

console.log(__dirname, __filename)

rl.on('line', function(line){
    var regexSentence = /i want product \[[\d]\]/
    var match = regexSentence.test(line);
    if (!match) {
        console.log('Error in order sentence')
    }
    else{
        var regex = /[\d]/g;
        var found = line.match(regex);
        ordersfunctions.orderProductBydId(found) 
    }
})
