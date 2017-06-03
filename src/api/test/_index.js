var config = require('config');
var api = require('../index');
var server;

before(done => {
    api.start(() => {
        server = api.app.listen(config.get('port'), done);
    });
});

after(done => {
    setTimeout(() => server.close(), 1000);
    done()
});