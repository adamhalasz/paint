const mongodb = require('mongodb');
const handleError = require('../utils/handleError');
var db, logger;

class Board{
    constructor(app){
        db = app.db;
        logger = app.logger;
    }

    get(req, res){
        db.boards.findOne({ _id: new mongodb.ObjectID(req.params.id.toString()) }).then(board => {
            var data = {};
            data.ok = true;
            data.board = board;
            res.json(data);
        }).catch(handleError(req, res));
    }

    create(req, res){
        var data = {};
        var board = {
            title: req.body.title,
            creatorId: new mongodb.ObjectID(req.user._id),
            creatorUsername: req.user.username,
            views: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        console.log('board', board)

        db.boards.insertOne(board).then(newBoard => {
            logger.log('debug', 'Success with db.boards.insertOne:', newBoard.ops[0]);
            data.board = newBoard.ops[0];
            data.ok = true;
            res.json(data);
        }).catch(handleError(req, res));
    }

    delete(req, res){
        db.boards.deleteOne({ 
            _id: new mongodb.ObjectID(req.params.id.toString()),
            creatorId: new mongodb.ObjectID(req.user._id.toString())
        }).then((response) => {
            console.log('DELETE BOARD req.user._id', req.user._id);
            console.log('DELETE BOARD response.deletedCount', response.deletedCount);
            logger.log('debug', 'DELETE BOARD response ' + JSON.stringify(response));
            var data = {};
            data.ok = true;
            data.deletedCount = response.deletedCount;
            res.json(data);
        }).catch(handleError(req, res));
    }

    update(req, res){
        req.body.updatedAt = new Date();
        db.boards.updateOne({ 
            _id: new mongodb.ObjectID(req.params.id),
            creatorId: req.user._id
        }, {
            $set: req.body
        }).then(response => {
            var data = {};
            data.ok = true;
            res.json(data);
        }).catch(handleError(req, res));
    }

    authorize(req, res, next){
        db.boards
        .find({ creatorId: new mongodb.ObjectID(req.user._id.toString()) })
        .toArray()
        .then((response) => {
            req.data.boards = response;
            next()

        }).catch(handleError(req, res));
    }
}


module.exports = Board;