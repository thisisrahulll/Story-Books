const GoogleStrategy = require("passport-google-oauth20");
const Users = require("../models/users");
const passportStra = function(passport) {
    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/redirect"
        },
        async(accessToken, refreshToken, profile, done) => {
            try {
                const newUser = new Users({
                    google_id: profile.id,
                    displayName: profile.displayName,
                    user_img: profile.photos[0].value,
                    email: profile.emails[0].value
                })
                let user = await Users.findOne({ email: profile.emails[0].value });
                if (user) {
                    done(null, user)
                } else {
                    user = await Users.create(newUser);
                    done(null, user)
                }
            } catch (err) {
                console.error(err)
            }

        }
    ));
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        Users.findById(id, function(err, user) {
            done(err, user);
        });
    });
}
module.exports = passportStra