const LocalStrategy = require("passport-local");
const ourUser = require("../models/ouruser");
const passportStra = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        ourUser.findById(id, function(err, user) {
            done(err, user);
        });
    });
    passport.use(new LocalStrategy({ usernameField: 'email' },
        async function(email, password, done) {
            try {
                const user = await ourUser.findOne({ email: email })
                if (!user) {
                    return done(null, false, { message: "Email is not registered " });
                } else {
                    if (user.password != password) {
                        done(null, false, { message: "Password is invalid " });
                    } else {
                        console.log("hii")

                        return done(null, user);
                    }
                }
            } catch (err) {
                console.error(err)
            }
            // console.log("hy")
            // ourUser.findOne({ email: email }, function(err, user) {
            //     if (err) { return done(err); }
            //     if (!user) { return done(null, false); }
            //     if (!user.password == password) { return done(null, false); }
            //     return done(null, user);
            // });
        }
    ));
    // passport.use(new GoogleStrategy({
    //         clientID: process.env.GOOGLE_CLIENT_ID,
    //         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //         callbackURL: "/auth/google/redirect"
    //     },
    //     async(accessToken, refreshToken, profile, done) => {
    //         try {
    //             const newUser = new Users({
    //                 google_id: profile.id,
    //                 displayName: profile.displayName,
    //                 user_img: profile.photos[0].value,
    //                 email: profile.emails[0].value
    //             })
    //             let user = await Users.findOne({ email: profile.emails[0].value });
    //             if (user) {
    //                 done(null, user)
    //             } else {
    //                 user = await Users.create(newUser);
    //                 done(null, user)
    //             }
    //         } catch (err) {
    //             console.error(err)
    //         }

    //     }
    // ));

}
module.exports = passportStra