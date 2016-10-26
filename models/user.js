var crypto = require('crypto');

var mongoose = require("libs/mongoose");
mongoose.Promise = global.Promise;
var schema = mongoose.Schema({
    userName: {
        type: String
    }
});

exports.User = mongoose.model('User', schema);
