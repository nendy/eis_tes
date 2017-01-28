var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var path = require('path');
var CFG = require('./config');
var helper = require('./lib/helper');
var db_init = require('./lib/db');
var router = require('./routes');
var ENV = process.env.NODE_ENV;

console.log('use ENV:',ENV);

var app = express();
db_init.connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(helper);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public')));

router(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler will print stacktrace
// production error handler no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: ENV == 'production' ? {} : err
  });
  console.log(err);
});

var server = require('http').createServer(app);

server.listen(CFG.port);
server.on('error', function(error) {
  console.log('error:',error);
});
server.on('listening', function() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
});