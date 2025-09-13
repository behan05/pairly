const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../../models/User.model');
const fetch = require('node-fetch');

// GitHub Strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_REDIRECT_URI,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let email = null;

                if (profile.emails && profile.emails.length > 0) {
                    email = profile.emails[0].value;
                } else {
                    // fetch emails via GitHub API
                    const res = await fetch("https://api.github.com/user/emails", {
                        headers: { Authorization: `token ${accessToken}` }
                    });
                    const emails = await res.json();
                    const primaryEmail = emails.find(e => e.primary && e.verified);
                    if (primaryEmail) email = primaryEmail.email;
                }

                if (!email) {
                    return done(new Error("Email not available from GitHub"));
                }

                let user = await User.findOne({ email });
                if (!user) {
                    user = await User.create({
                        fullName: profile.displayName || profile.username,
                        email,
                        authProvider: 'github',
                    });
                }

                return done(null, { id: user._id });
            } catch (error) {
                return done(error);
            }
        }
    )
);
