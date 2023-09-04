const express = require("express");
const app = express();
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv");
const morgan = require("morgan");
const dbconnect = require("./config/db");
const storyRoutes = require("./routes/stories");
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const indexRoute = require("./routes/index");
const passport = require("passport");
const authRoutes = require("./routes/auth")
const bodyParser = require('body-parser')
    // Configiring my env variables 
dotenv.config({ path: "./config/config.env" });

require("./config/passport")(passport);



app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }))

//Morgan Middleware
if (process.env.NODE_ENV == "development") {
    app.use(morgan("dev"))
}
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))
app.use(passport.initialize());
app.use(passport.session());
//EJS Middleware 
app.use(require('flash')());
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
app.set('view engine', 'ejs');
app.use(expressLayouts);

dbconnect();


app.use("/", indexRoute);
app.use("/auth", authRoutes);
app.use("/stories", storyRoutes);



const port = process.env.PORT || 5000;
app.listen(port || 5000, () => {
    console.log(`Express App started at port ${port}`);
})