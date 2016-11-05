// Declares dependencies
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request'); 
var cheerio = require('cheerio');

// Configures Express server
var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: true
}));// Parse application/x-www-form-urlencoded
app.use(bodyParser.json());

// Sets up Handlebars as the view engine 
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Makes public a static directory
app.use(express.static(process.cwd() + '/public'));

// Configures database with mongoose
mongoose.connect((process.env.MONGODB_URI ||'mongodb://localhost/headline-sticky-notes'));
var db = mongoose.connection;

// Displays mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// Logs successful mongoose db login
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

var public_routes = require('./controllers/public_routes.js');
var sticky_note_routes = require('./controllers/sticky_note_routes.js');
app.use('/', public_routes);
app.use('/', sticky_note_routes);

// Listening
app.listen(app.get('port'), function() {
  console.log("Express server listening on port %d in %s mode", 
  	this.address().port, app.settings.env);
});