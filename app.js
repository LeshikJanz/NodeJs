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

var mongoose = require('libs/mongoose');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

/* Работает с сессиями. Создает уникальный идентификатор для сессии, по кот будут восстановлены данные
*  этой сессии.
* */
server.use(session({
    secret: config.get("session:secret"),        //исп. для создания цифровой подписи.не передается посетителю
    name: config.get("session:key"),
    cookie: config.get("session:cookie"),
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
})
);

server.get('/', function(req, res, next){
    res.render("index", {
        mes: "<h1>Good evening</h1>"
    });
});


/*
* Страница считает сколько раз была просмотрена тек. пользователем
 * и записывает данные в сессиию
*/
server.get('/session', function(req, res, next){
    req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
    res.send("" + req.session.numberOfVisits);
});

server.get('/xmlHttp', function(req, res, next){
    console.log(req.query);
    res.send("Получено");
});

server.get('/Test', function(req, res, next){
    res.render("test", {
        mes: "<b>Hi, my little friend</b>"
    })
});

var User = require("models/user").User;
server.get('/users', function(req, res, next){
    User.find({}, function(err, users){
        if(err) next(err);
        res.json(users);
    })
});


server.get('/remove', function(req, res, next){
    User.remove({}, function(err, req, res){
        if(err) throw err;
    });
    res.end("Удалено");
});

server.get('/add', function(req, res, next){
    var user = new User();
    console.log(req.query.name);
    user.userName = "Lesha";
    user.userLastName = "Teresh";
    user.save(function(err, user, affected){
        if(err) next(err);
    });
    res.end("Добавлено");
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

module.exports = server;
