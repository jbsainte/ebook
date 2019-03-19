let user = require('./models/user')

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

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;