const mongodb = require('mongodb');
const handleError = require('../utils/handleError');
const sha256 = require('sha256');
const passport = require('passport');
var db, logger;

class User {
    
    constructor(app){
        db = app.db;
        logger = app.logger;
    }

    login(req, res, next){
        console.log('LOGIN REQUESTED', req.body);
        passport.authenticate('local', function(err, user, info) {
            if (err) {  
                logger.error('Passport Authentication Error', err);
                return res.json({ ok: false, error: (err.message || err) })
            
            } else if (!user) { 
                return res.json({ ok: false, error: 'Invalid Credentials' })
            
            } else {
                req.login(user, function(err) {
                    if (err) { 
                        logger.error('Error with req.Login', user, err);
                        return next(err); 
                    } else {
                        logger.log('debug', 'req.Login info', req.user);
                        req.data = {};
                        req.data.user = user;
                        req.data.ok = true;
                        next();

                        //res.cookie('connect.sid', randomNumber, { maxAge: 900000, httpOnly: true });
            
                    }
                });
            }
        })(req, res, next);
    }

    signup(req, res, next){
        console.log('SIGNUP REQUESTED', req.body);
        req.data = {};
        if(!req.body.username || !req.body.password){
            data.ok = false;
            data.error = 'username and password are required';
            res.json(data);
            return;
        }
        db.users.findOne({
            username: req.body.username
        }).then(user => {
            if(user){
                req.data.ok = false;
                req.data.error = 'username already exists';
                res.json(data)
            } else {
                db.users.insertOne({
                    username: req.body.username,
                    password: sha256(req.body.password)
                }).then(newUser => {
                    logger.log('debug', 'Success with db.users.insertOne:', newUser.ops[0]);
                    req.data.user = newUser.ops[0];
                    delete req.data.user.password;
                    req.data.ok = true;

                    // login
                    req.login(req.data.user, function(err) {
                        if (err) { 
                            logger.error('Error with req.Login', user, err);
                            return next(err); 
                        } else {
                            logger.log('debug', 'req.Login info', req.user);
                            next();

                            //res.cookie('connect.sid', randomNumber, { maxAge: 900000, httpOnly: true });
                
                        }
                    });

                }).catch(handleError)
            }

        }).catch(handleError)
    }

    delete(req, res){
        db.users.deleteOne({
            _id: new mongodb.ObjectID(req.user._id.toString())
        }).then((response) => {
            db.boards.deleteMany({
                creatorId: new mongodb.ObjectID(req.user._id.toString())
            }).then((boardDeletedResponse) => {
                req.logout(); 
                res.json({ ok: true, 
                    deletedCount: response.deletedCount, 
                    deletedBoardCount: boardDeletedResponse 
                });
            }).catch(handleError);
        }).catch(handleError);
    }

    logout(req, res){
        req.logout();
        res.json({ ok: true });
    }

    authorize(req, res, next){
        if(req.isAuthenticated()){
            if(!req.data) req.data = {};
            req.data.ok= true
            req.data.user = req.user;
            next();
        } else {
            res.json({ ok: false, user: null })
        }
    }

    authorizeEnd(req, res) {
        res.json(req.data);
    }
    
    isAuthenticated(req, res, next) {
        if(req.isAuthenticated()){
            next()
        } else {
            res.status(403);
            res.json({
                ok: false,
                error: 'Unauthorized Request'
            })
        }
    }
}

module.exports = User;