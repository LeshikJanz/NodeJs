var User = require('../models/user').User;
var async = require('async');

exports.get = function(req, res){
    res.render("login", { title: "Login" })
};

exports.post = function(req, res){

    console.log("userName: " + req.body.userName);
    console.log("userPassword: " + req.body.userPassword);

    User.findOne({userName: req.body.userName}, function(err, user){
        if(err) next(err);
        if(user){
            console.log("user: " + user);
            if(user.userPassword == req.body.userPassword){
                console.log("Успешная авторизация!");
                res.status(200).send("Успешная авторизация");
            }else {
                console.log("Пароль неверен!");
                res.status(403).send("Пароль неверен");
            }
        }else {
            console.log("Нужен новый пользователь!");
            var user = new User({ userName: req.body.userName, userPassword: req.body.userPassword });
            user.save(function(err){
                if(err) return next(err);
            })
        }
    })
};