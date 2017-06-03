const mongodb = require('mongodb');
const sha256 = require('sha256');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;

class Passport{
    constructor(app){
        var db = app.db;
        
    
        passport.serializeUser(function(user, done) {
            done(null, user._id.toString());
        });

        passport.deserializeUser(function(id, done) {
            db.users.findOne({ _id: mongodb.ObjectId(id) }, function(err, user) {
                done(err, user);
            });
        });

        passport.use(new Strategy(function(username, password, done){
            db.users.findOne({ username: username }, function(err, user){
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (user.password !== sha256(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            })
        }));
    }
}

module.exports = Passport;