// polyfills
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import 'rxjs/Rx';

// angular
import { enableProdMode } from '@angular/core';

// libs
import * as express from 'express';
import * as compression from 'compression';
import { ngExpressEngine } from '@ngx-universal/express-engine';

// module
import { AppServerModule } from './app/app.server.module';

enableProdMode();
const server = express();
server.use(compression());

/**
 * Set view engine
 */
server.engine('html', ngExpressEngine({
  bootstrap: AppServerModule
}));

server.set('view engine', 'html');
server.set('views', 'public');

/**
 * Point static path to `public`
 */
server.use('/', express.static('public', {index: false}));

const fruitNames = ['Apple', 'Orange', 'Banana', 'Mango', 'Kiwi',
'Apricot', 'Avocado', 'Cherry', 'Coconut', 'Fig', 'Grape', 'Pear', 'Peach', 'Lime'];
const fruits: Array<any> = [];
var index = 0;
const len = fruitNames.length;
var price;

for (var i = 0; i < 1000; i++) {
  index = Math.floor(Math.random() * len);
  price = Math.floor(Math.random() * 5) + 5; // from $5 - $10
  fruits.push({name: fruitNames[index], price});
}
server.get('/data', (req, res) => {
  console.log('Catched GET /data in HMR');
  res.json({
    ok: true,
    fruits: fruits
  });
});

server.get('/home-data', (req, res) => {
  res.json({
    ok: true,
    name: 'John Doe',
    items: ['knife', 'sword', 'hat', 'rope']
  });
});

/**
 * Catch all routes and return the `index.html`
 */
server.get('*', (req, res) => {
  console.log('Catched *');
  res.render('../public/index.html', {
    req,
    res
  });
});

/**
 * Port & host settings
 */
const port = 1337;
const PORT = process.env.PORT || port;
const HOST = process.env.BASE_URL || 'localhost';
const baseUrl = `http://${HOST}:${PORT}`;

server.set('port', PORT);

/**
 * Begin listening
 */
server.listen(server.get('port'), () => {
  // tslint:disable-next-line
  console.log(`Express server listening on ${baseUrl}`);
});
