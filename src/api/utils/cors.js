const config = require('config');
const cors = require('cors');
const whitelist = config.get('corsWhitelist');

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  preflightContinue: true
}

class Cors {
    constructor(app){
        app.options('*', cors(corsOptions))
        app.use(cors(corsOptions));
    }
}

module.exports = Cors;