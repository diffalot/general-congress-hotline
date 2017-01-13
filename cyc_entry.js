const express = require('express');
const path = require('path');
const logger = require('morgan');
const compression = require('compression');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.load();

if (!process.env.CONFIG) {
  console.error('WARNING: No CONFIG specified in your .env, defaulting to config/default.js');
} else {
  console.log('Using environment:', process.env.CONFIG);
}

const app = express();

app.set('view engine', 'html');
app.set('port', process.env.PORT || 17738);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Controllers
const switchboardController = require('./controllers/switchboard');
const phoneController = require('./controllers/phone');
const errorRedirectController = require('./controllers/error-redirect');

app.post('/switchboard', switchboardController.switchboard);
app.get('/switchboard', switchboardController.switchboardTestGet);

app.post('/fedceral/start', phoneController.federalStart);
app.get('/federal/start', phoneController.federalStartTestGet);

app.post('/federal/call', phoneController.federalCall);
app.get('/federal/call', phoneController.federalCallTestGet);

app.post('/error_redirect/:redirect', errorRedirectController);

// Production error handler
if (app.get('env') === 'production') {
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

module.exports = app;
