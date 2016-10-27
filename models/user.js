var crypto = require('crypto');
var async = require('async');

var mongoose = require("libs/mongoose");
mongoose.Promise = global.Promise;
var schema = mongoose.Schema({
    userName: {
        type: String
    },
    userPassword: {
        type: String
    }
});

exports.User = mongoose.model('User', schema);
