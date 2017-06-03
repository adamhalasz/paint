const config = require('config');
const express = require('express');
const app = express();

const RouteModels = require('./models/routes');
const DatabaseModels = require('./models/database');
const PassportController = require('./controllers/passport');
const WebSocketController = require('./controllers/websocket');

const LoggerUtility = require('./utils/logger');
const logger = new LoggerUtility(app);

const winston = require('winston');
app.logger = new winston.Logger({ level: config.get('logLevel'), transports: [ new winston.transports.Console() ]});

const CorsUtility = require('./utils/cors'); 
const cors = new CorsUtility(app);
const passport = require('passport');
const bodyParser = require('body-parser');
app.expressSession = require('express-session')({ name: 'session.cookie', secret: 'keyboard cat', resave: true, saveUninitialized: true });
app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(app.expressSession);
app.use(passport.initialize());
app.use(passport.session());

function Main(done){
    logger.setupMorgan();
    logger.setupWinstonLogger();

    new DatabaseModels(app)
        .then(afterDatabase)
        .catch(logger.error);

    function afterDatabase(){
        new PassportController(app);
        new RouteModels(app);
        new WebSocketController(app);
        logger.setupWinstonErrors();
        if(done) done();
    }
}

// Exports
module.exports.app = app;
module.exports.start = (done) => Main(done) ;
if(!module.parent) {
    app.server = app.listen(config.port, () => {
        Main();
        logger.info(`App listening on port ${config.port}`)
    })
};