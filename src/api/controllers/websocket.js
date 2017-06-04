var app, db, io;
var mongodb = require('mongodb');

var timer = 0;
class WebSocket {
    constructor(parent){
        app = parent, db = parent.db;
        io = app.io = require('socket.io')(app.server);
        io.use(this.expressSession);
        io.sockets.on('connection', this.socketHandler);
    }


    expressSession(socket, next) {
        app.expressSession(socket.request, {}, next);
    }

    socketHandler(socket) {
        console.log('A user connection');
        //var userId = socket.request.session.passport.user;
        console.log("Your User ID is", socket.request.session);

        socket.on('message', function(message){
            console.log('A user sent a message', message);
            io.sockets.emit('message', 'HELLO_WORLD_INITIALIZED_'+timer+message);
        });

        socket.on('draw', function(data){
            console.log('DRAW data', data.boardId)
            socket.broadcast.to(data.boardId.toString()).emit('draw-share', data);
            db.boards.updateOne({ 
                _id: new mongodb.ObjectID(data.boardId)
            }, {
                $set: {
                    canvas: data.canvas
                }
            }, function(err, response){
                if(err) {
                    console.error(err);
                }
            });
        })

        socket.on('draw-share', function(data){
            console.log('## draw-share');
            socket.emit('draw-share', data);
        })

        socket.on('join-board', function(boardId){
            console.log('Socket Joined Board', boardId);
            socket.join(boardId.toString());
        })


        socket.on('leave-board', function(boardId){
            console.log('Socket Left Board', boardId);
            socket.leave(boardId.toString());
        })

        socket.on('disconnect', () => {
            console.log(`User ... has disconnected`); // (${userId})
        });
    }
}

module.exports = WebSocket;