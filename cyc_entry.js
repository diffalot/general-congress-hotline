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

// Controllers
const mainMenuController = require('./controllers/main-menu');
const federalController = require('./controllers/federal');

const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}

app.set('view engine', 'html');
app.set('port', process.env.PORT || 17738);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/main_menu', mainMenuController.mainMenu);
app.post('/main_menu_redirect', mainMenuController.mainMenuRedirect);
app.post('/federal_start', federalController.federalStart);
app.post('/federal_lookup', federalController.federalLookup);

// Production error handler
if (app.get('env') === 'production') {
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

module.exports = app;
