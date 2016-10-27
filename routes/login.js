exports.get = function(req, res){
    res.render("login", { title: "Login" })
};

exports.post = function(req, res){

    console.log("userName: " + req.body.userName);
    console.log("userPassword: " + req.body.userPassword);
};