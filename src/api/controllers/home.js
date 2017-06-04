const async = require('async');
const mongodb = require('mongodb');
const handleError = require('../utils/handleError');
var db, logger;

class Home {
    constructor(app){
        db = app.db;
    }
    get (req, res){
        req.data = {};
        req.data.ok = true;
        req.data.message = 'welcome';
        async.parallel([getUsers, getBoards], finish)

        function getBoards(next){
            db.boards.find({}).sort({ createdAt: -1 }).limit(20).toArray().then(data => {
                req.data.boards = data;
                next();
            }).catch(next);
        }

        function getUsers(next){
            db.users.find({}).sort({ createdAt: -1 }).limit(20).toArray().then(data => {
                req.data.users = data;
                req.data.users.forEach(user => {
                    delete user.password;
                })
                next();
            }).catch(next);
        }

        function finish(err){
            if(err) {
                handleError(req,res)(err);
            } else {
                res.json(req.data);
            }
        }
    }
}

module.exports = Home;