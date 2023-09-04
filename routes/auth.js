const router = require("express").Router();
const passport = require("passport");
router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get("/google/redirect", passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect("/dashboard")
})

module.exports = router