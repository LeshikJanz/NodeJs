var express = require('express');
var path = require('path');
var http = require('http');
var config = require('config')
var log = require('./libs/log')(module);
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express(); //создаем объект сервера express со всеми нужными параметрами
app.use(bodyParser.json()); //парсит json, form и после все свойства будут доступны в req.body.свойство

//var users = require('./routes/users')(app);

app.engine('ejs', require('ejs-locals')); //добавляет возможности layout, partial, block

app.set('views', path.join(__dirname, 'views'));  //подключаем пути к шаблонам
app.set('view engine', 'ejs');  //подключаем шаблонизатор ejs

app.use(favicon(path.join(__dirname, 'favicon', 'favicon.ico')));
app.use(logger('dev')); //еще один логер

app.use(cookieParser()); //разбирает req.headers и делает req.cookies



var mongoose = require('libs/mongoose');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

/* Работает с сессиями. Создает уникальный идентификатор для сессии, по кот будут восстановлены данные
*  этой сессии.
* */
app.use(session({
    secret: config.get("session:secret"),        //исп. для создания цифровой подписи.не передается посетителю
    name: config.get("session:key"),
    cookie: config.get("session:cookie"),
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
})
);
var routes = require('./routes/index')(app);

/*
* Страница считает сколько раз была просмотрена тек. пользователем
 * и записывает данные в сессиию
*/
app.get('/session', function(req, res, next){
    req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
    res.send("" + req.session.numberOfVisits);
});

app.get('/xmlHttp', function(req, res, next){
    console.log(req.query);
    res.send("Получено");
});

app.get('/Test', function(req, res, next){
    res.render("test", {
        mes: "<b>Hi, my little friend</b>"
    })
});

var User = require("./models/user").User;
app.get('/users', function(req, res, next){
    User.find({}, function(err, users){
        if(err) next(err);
        res.json(users);
    })
});


app.get('/remove', function(req, res, next){
    User.remove({}, function(err, req, res){
        if(err) throw err;
    });
    res.end("Удалено");
});

app.get('/add', function(req, res, next){
    var user = new User();
    console.log(req.query.name);
    user.userName = "Alex";
    user.userPassword = "123";
    user.save(function(err, user, affected){
        if(err) next(err);
    });
    res.end("Добавлено");
});

/*
Смотрит, если никакие из вышеперечисленных Middleware-обработчиков не сработали, то
переходит в папку public и отдает нужный файл
*/
app.use(express.static(path.join(__dirname, 'public')));

http.createServer(app).listen(config.get('port'), function(){
    log.info('Express app is listening on ' + config.get('port'));
});

app.use(function(err, req, res, next){
    if(app.get('env') == 'development'){
        res.status(500).send(err.toString());
        console.log(err);
    }else next();
});

app.use(function(req, res, next){ //замыкающий обработчик
    res.status(404).send("Page not found");
});

module.exports = app;
