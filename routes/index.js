/*
* Описание всех routes(путей). Как можно добраться до обработчиков из браузера.
 * Каждый обработчик должен реализовать функцию get, а в ней отдать обработанную ejs страницу.
* */

module.exports = function(app){
  app.get('/', require("./frontpage").get);

  app.get('/login', require("./login").get);
  app.post('/login', require("./login").post);

  app.get('/chat', require("./chat").get);
}
