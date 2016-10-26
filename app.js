var express = require('express');
var path = require('path');
var http = require('http');
var config = require('config')
var log = require('./libs/log')(module);
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var server = express(); //создаем объект сервера express со всеRми нужными параметрами

server.engine('ejs', require('ejs-locals')); //добавляет возможности layout, partial, block

server.set('views', path.join(__dirname, 'views'));  //подключаем пути к шаблонам
server.set('view engine', 'ejs');  //подключаем шаблонизатор ejs

server.use(favicon(path.join(__dirname, 'favicon', 'favicon.ico')));
server.use(logger('dev')); //еще один логер
server.use(bodyParser.json()); //парсит json, form и после все свойства будут доступны в req.body.свойство

server.use(cookieParser()); //разбирает req.headers и делает req.cookies

server.use('/', routes);  //позволяет просто обрабатывать get, post .. запросы. Пример ниже

//server.get('/Test', function(req, res, next){
//    res.end("My Test");
//});

server.get('/Test', function(req, res, next){
    res.render("index", {
        mes: "<b>Hi, my little friend</b>"
    })
});

/*
Смотрит, если никакие из вышеперечисленных Middleware-обработчиков не сработали, то
переходит в папку public и отдает нужный файл
*/
server.use(express.static(path.join(__dirname, 'public')));

http.createServer(server).listen(config.get('port'), function(){
    log.info('Express server is listening on ' + config.get('port'));
});

server.use(function(err, req, res, next){
    if(server.get('env') == 'development'){
        res.status(500).send(err.toString());
        console.log(err);
    }else next();
});

server.use(function(req, res, next){ //замыкающий обработчик
    res.status(404).send("Page not found");
});
//
//

//
//
//
//// view engine setup

//
//// uncomment after placing your favicon in /public

//

//
//// catch 404 and forward to error handler
//server.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//  next(err);
//});
//
//// error handlers
//
//// development error handler
//// will print stacktrace
//if (server.get('env') === 'development') {
//  server.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//      message: err.message,
//      error: err
//    });
//  });
//}
//
//// production error handler
//// no stacktraces leaked to user
//server.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.render('error', {
//    message: err.message,
//    error: {}
//  });
//});
//
//
//module.exports = server;
