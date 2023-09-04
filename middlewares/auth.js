module.exports = {
    checkAuthentication: function(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect("/");
        }
    },
    checkAdmin: function(req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect("/dashboard");
        } else {
            next();
        }
    }
}