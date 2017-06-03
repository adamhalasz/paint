var assert = require('assert');

var request = require('request');
    request = request.defaults({ jar: true });

var config = require('config');
var api = config.get('host');
var winston = require('winston');
var logger = new winston.Logger({ level: config.get('logLevelTest'), transports: [ new winston.transports.Console() ]});

describe('User Tests', function(){
    var user = {};
        user.username = 'test_john_doe_'+ (new Date().getTime().toString(32));
        user.password = 'example_password';

    it('should CREATE a new user', function(done){
        request.post(api+'signup', {
            form: {
                username: user.username,
                password: user.password
            }
        }, function(err, httpResponse, body){
            body = JSON.parse(body);
            logger.log('debug', 'body', body);
            assert.equal(err, null);
            assert.equal(body.ok, true);
            assert.equal(typeof body.user, 'object');
            assert.equal(typeof body.user._id, 'string');
            assert.equal(body.user.username, user.username);
            user._id = body.user._id;
            done();
        })
    })

    it('should LOGIN with the newly created user', function(done){
        request.post(api+'login', {
            form: {
                username: user.username,
                password: user.password
            }
        }, function(err, httpResponse, body){
            body = JSON.parse(body);
            assert.equal(err, null);
            assert.equal(body.ok, true);
            assert.equal(typeof body.user, 'object');
            assert.equal(typeof body.user._id, 'string');
            assert.equal(body.user.username, user.username);
            done();
        })
    });

    it('should LOGOUT with the newly created user', function(done){
        request.post(api+'logout', function(err,httpResponse,body){
            body = JSON.parse(body);
            assert.equal(err, null);
            assert.equal(body.ok, true);
            done();
        })
    })

    it('should DELETE the newly created user', function(done){
        request.post(api+'login', {
            form: {
                username: user.username,
                password: user.password
            }
        }, function(err, httpResponse, body){
            assert.equal(err, null);
            body = JSON.parse(body);
            console.log('DELETE LOGIN body', body)
            assert.equal(body.ok, true);
            assert.equal(typeof body.user, 'object');
            assert.equal(body.user.username, user.username);
            deleteRequest()
        })

        function deleteRequest(){
            request.delete(api+'user', function(err, httpResponse, body){
                logger.log('debug', 'DELETE body', body);
                body = JSON.parse(body);
                console.log('DELETE REQUEST body', body)
                assert.equal(err, null);
                assert.equal(body.ok, true);
                assert.equal(body.deletedCount, 1);
                done();
            })
        }
    })
})

