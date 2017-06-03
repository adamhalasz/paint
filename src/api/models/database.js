const mongodb = require('mongodb');
const config = require('config');
const MongoClient = mongodb.MongoClient;

class Mongo {
    constructor(app){
        return new Promise((resolve, reject) => {
            MongoClient.connect(config.get('mongoUrl'), (err, database) => {
                if(err) {
                    reject(err)
                } else {
                    var db = app.db = database;
                    db.users = db.collection('users');
                    db.boards = db.collection('boards');
                    resolve();
                }
            });
        });
    }
}

module.exports = Mongo;