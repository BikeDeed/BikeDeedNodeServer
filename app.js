var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');

var walletRouter = require('./routes/wallet');
var bikesRouter = require('./routes/bikes');
var indexRouter = require('./routes/index');

var app = express();

let contractAddress;
let web3Provider;
let extendedPrivateKey = process.env.EXTENDED_PRIVATE_KEY;

console.log("ENV: " + app.get('env'));
console.log("EXTENDED_PRIVATE_KEY: " + extendedPrivateKey);

switch(app.get('env')) {
  case 'production':
    contractAddress = '0xa7aB6FcA68f407BB5258556af221dE9d8D1A94B5';
    web3Provider = 'https://mainnet.infura.io/uHJFDlXprJ52gu4uK9oA';
    break;
  case 'development':
  default:
    contractAddress = '0x83f306d638daeedc8895ba5ae6dc6e173195e056';
    web3Provider = 'https://ropsten.infura.io/uHJFDlXprJ52gu4uK9oA';
    break;
}

app.set('contractAddress', contractAddress);
app.set('web3Provider', web3Provider);
app.set('extendedPrivateKey', extendedPrivateKey);

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
  next();
});

app.use('/wallet', walletRouter);
app.use('/bikes', bikesRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
