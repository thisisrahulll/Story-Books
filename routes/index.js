const express = require("express");
const router = require("express").Router();
const ourUsers = require("../models/ouruser");
const { checkAuthentication, checkAdmin } = require("../middlewares/auth");
const passport = require("passport");
router.get("/", checkAdmin, (req, res) => {
    res.render("login")
})
router.get("/dashboard", checkAuthentication, (req, res) => {
    res.render("home", {
        layout: "dashboard",
        image: req.user.user_img,
        name: req.user.displayName,
    })
});
router.post("/login", (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard1',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next);
});
router.post("/register", async(req, res) => {
    const errs = [];
    //Check All the fields are required
    const { email, password, name } = req.body;
    if (email == "" || password == "") {
        errs.push("All fields are required !!");
        return res.render("register", {
            errs: errs
        });
    }
    try {
        const user = await ourUsers.findOne({ email: email })
        if (user) {
            errs.push("Email is already registered ");
            return res.render("register", {
                errs: errs
            });
        } else {
            if (password.length < 6) {
                errs.push("Password must be atleast 6 digit long");
                return res.render("register", {
                    errs: errs
                });
            } else {
                const newUser = new ourUsers({
                    displayName: name,
                    email: email,
                    password: password
                })
                await ourUsers.create(newUser);
                req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                );
                res.redirect("/");
            }
        }
    } catch (err) {
        console.error(err)
    }
})
router.get("/logout", (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You are logged out');
    res.redirect("/");

})
module.exports = router