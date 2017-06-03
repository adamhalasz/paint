const UserController = require('../controllers/user'); 
const BoardController = require('../controllers/board');
const HomeController = require('../controllers/home');

class Routes {
    constructor(app){
        // controllers
        const user = new UserController(app);
        const board = new BoardController(app);
        const home = new HomeController(app);

        // home
        app.get('/', home.get)

        // users
        app.post('/signup', user.signup);
        app.post('/login', user.login, board.authorize, user.authorizeEnd);  
        app.post('/logout', user.logout); 
        app.delete('/user', user.isAuthenticated, user.delete); 
        app.get('/authorize', 
            user.authorize, 
            board.authorize, 
            user.authorizeEnd)

        // boards
        app.get('/board/:id', board.get);
        app.post('/board', user.isAuthenticated, board.create);
        app.put('/board/:id', user.isAuthenticated, board.update);
        app.delete('/board/:id', user.isAuthenticated, board.delete);
    }
}

module.exports = Routes;