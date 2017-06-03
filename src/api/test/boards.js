var assert = require('assert');

var request = require('request');
    request = request.defaults({ jar: true });
    
var config = require('config'); 
var async = require('async');
var winston = require('winston');
var logger = new winston.Logger({ level: config.get('logLevelTest'), transports: [ new winston.transports.Console() ]});

var api = config.get('host');

var board = {
    _id: null,
    title: 'My New Board',
    creatorId: null,
    views: 0,
    createdAt: new Date(),
    updatedAt: new Date()
};

// Default User Account
var user = {};
    user.username = 'test_john_doe_'+ (new Date().getTime().toString(32));
    user.password = 'example_password';

before(function(done) {

    async.series([signup, login], done)

    function signup(next){
        // Create New User
        request.post(api+'signup', {
            form: {
                username: user.username,
                password: user.password
            }
        }, function(err, httpResponse, body){
            body = JSON.parse(body);
            logger.log('debug', 'signup body', body)
            assert.equal(err, null);
            assert.equal(body.ok, true);
            assert.equal(typeof body.user, 'object');
            assert.equal(typeof body.user._id, 'string');
            assert.equal(body.user.username, user.username);
            user._id = body.user._id;
            board.creatorId = user._id; 
            next();
        });
    }

    function login(next){
        request.post(api+'login', {
            form: {
                username: user.username,
                password: user.password
            }
        }, function(err, httpResponse, body){
            body = JSON.parse(body);
            logger.log('debug', 'login body', body)
            assert.equal(err, null);
            assert.equal(body.ok, true);
            assert.equal(typeof body.user, 'object');
            assert.equal(typeof body.user._id, 'string');
            assert.equal(body.user.username, user.username);
            logger.log('request jar', request.jar());
            next();
        });
    }
})


describe('Board Tests', function(){
    it('should CREATE a new board for user ' + user.username, function(done){
        request.post(api+'board', {
            form: board
        }, function(err, httpResponse, body){
            logger.log('debug', 'TEST: POST: BOARD BODY RESPONSE', body)
            body = JSON.parse(body);
            assert.equal(err, null);
            assert.equal(body.ok, true);
            assert.equal(typeof body.board, 'object');
            assert.equal(typeof body.board._id, 'string');
            assert.equal(typeof body.board.creatorId, 'string');
            assert.equal(body.board.title, board.title);
            board._id = body.board._id;
            done();
        });
    })

    it('should READ the newly created board for user ' + user.username, function(done){
        logger.log('CALL BOARD WITH ID', api+'board/'+board._id)
        request.get(api+'board/'+board._id, function(err,httpResponse,body){
            logger.log('debug', 'TEST: GET: BOARD BODY RESPONSE', body)
            body = JSON.parse(body);
            assert.equal(err, null);
            assert.equal(body.ok, true);
            assert.equal(typeof body.board, 'object');
            assert.equal(body.board._id, board._id);
            assert.equal(body.board.title, board.title);
            assert.equal(body.board.creatorId, user._id);
            done();
        });
    })

    it('should UPDATE the board title for the newly created board for the user ' + user.username, function(done){
        request.put(api+'board/'+board._id, {
            form: {
                title: 'My New Board Title',
            }
        }, function(err, httpResponse, body){
            logger.log('debug', 'TEST: UPDATE: BOARD BODY RESPONSE', body)
            body = JSON.parse(body);
            assert.equal(err, null);
            assert.equal(body.ok, true);
            done();
        });
    })

    it('should DELETE the newly created board for user ' + user.username, function(done){
        request.delete(api+'board/'+board._id, function(err,httpResponse,body){
            logger.log('debug', 'TEST: DELETE: BOARD BODY RESPONSE', body)
            body = JSON.parse(body);
            assert.equal(err, null);
            assert.equal(body.ok, true);
            assert.equal(body.deletedCount, 1);
            done();
        });
    })
});
    

after(done => {
    request.post(api+'login', {
        form: {
            username: user.username,
            password: user.password
        }
    }, function(err, httpResponse, body){
        request.delete(api+'user', (err, httpResponse, body) => {
            assert.equal(err, null);
            body = JSON.parse(body);
            console.log('AFTER DELETE', body);
            assert.equal(body.ok, true);
            assert.equal(body.deletedCount, 1);
            done();
        })
     });
})