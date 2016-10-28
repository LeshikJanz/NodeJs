exports.get = function(req, res){
    res.render("chat", {
        UserId: req.session.user
    })
};