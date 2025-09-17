const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../../models/User.model');

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI
},
    async (accessToken, refreshToken, profile, cb) => {
        try {
            // check user
            let user = await User.findOne({ email: profile.emails[0].value });

            if (!user) {
                // create new user
                user = await User.create({
                    fullName: profile.displayName,
                    email: profile.emails[0].value,
                    authProvider: 'google',
                    emailVerified: true
                });
            }

            // pass user id
            return cb(null, { id: user._id });
        } catch (err) {
            return cb(err);
        }
    }
));
