var crypto = require('crypto');

var mongoose = require("libs/mongoose");
mongoose.Promise = global.Promise;
var schema = mongoose.Schema({
    userName: {
        type: String
    },
    userLastName: {
        type: String,
        require: true
    }
});

exports.User = mongoose.model('User', schema);
