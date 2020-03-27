const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GithubStrategy({
        // options for google strategy
        clientID: keys.github.clientID,
        clientSecret: keys.github.clientSecret,
        callbackURL: "http://127.0.0.1:3000/auth/github/callback"
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists in our own db
        console.log("Profile:",profile)
        console.log("Access Token:",accessToken)
        User.findOne({githubIdId: profile.id}).then((currentUser) => {
            if(currentUser){
                // already have this user
                console.log('user is: ', currentUser);
                done(null, currentUser);
            } else {
                // if not, create user in our db
                new User({
                    githubId: profile.id,
                    username: profile.displayName,
                    thumbnail: profile._json.image.url
                }).save().then((newUser) => {
                    console.log('created new user: ', newUser);
                    done(null, newUser);
                });
            }
        });
    })
);
