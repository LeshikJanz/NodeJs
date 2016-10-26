var User = require('models/user').User;

var user = new User({
    userName: "Tester3"
});

User.find({}, function(err, obj){
    if(err) throw err;
    console.log(obj);
});
//
//User.remove({userName: "Tester"}, function(err, affected){
//    if(err) throw err;
//})
//console.log(user.userName);
user.save(function(err, user, affected){
    if(err) throw err;
})





//var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/myDb');
//
//var Cat = mongoose.model('Cat', { name: String }); //Объявляем модель
//
//var kitty = new Cat({  //создаем экземпляр модели
//    name: "Murka"
//})

//var MongoClient = require('mongodb').MongoClient
//    , assert = require('assert');
//
//// Connection URL
//var url = 'mongodb://localhost:27017/myDb';
//
//// Use connect method to connect to the server
//MongoClient.connect(url, function(err, db) {
//    var dbase = db;
//    assert.equal(null, err);
//    console.log("Connected successfully to server");
//
//    var collection = db.collection("users");
//    collection.remove({"lName": "Tereh"}, function(err, args){
//        if(err) throw err;
//    });
//
//    collection.insert({name: "Lesha", lName: "Tereh"}, function(err, docs){
//        if(err) throw err;
//    });
//    var cursor = collection.find();
//    cursor.forEach(function(obj){
//      console.log(obj);
//        console.log(obj.lName);
//    });
//
//    db.close();
//});
