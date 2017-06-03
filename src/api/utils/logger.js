const winston = require('winston');
const expressWinston = require('express-winston');
const config = require('config');
var app;

class Logger {
    constructor(parent){
        app = parent;
    }

    info(message){
        winston.log('info', message);
    }    

    error(message){
        winston.log('error', message);
    }    

    setupMorgan(){
        if(config.get('logLevel') != 'silent') app.use(require('morgan')('tiny'));
    }

    setupWinstonLogger(){
        app.use(expressWinston.logger({
            level: config.get('logLevel'),
            transports: [
                new winston.transports.Console({
                    json: true,
                    colorize: true
                })
            ],
            meta: true, // optional: control whether you want to log the meta data about the request (default to true)
            msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
            expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
            colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
            //ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
        }));
    }

    setupWinstonErrors(){
        app.use(expressWinston.errorLogger({
            transports: [
            new winston.transports.Console({
                json: true,
                colorize: true
            })
            ]
        }));
    }
}

module.exports = Logger;