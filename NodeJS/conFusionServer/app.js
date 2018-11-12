const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

const url = 'mongodb://localhost:27017/dishes';
const opts = { useNewUrlParser: true };

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

mongoose.connect(url, opts)
    .then(() => {
      console.log('Connected correctly to the server');
    })
    .catch(err => console.log(err));

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09867-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

app.use(function (req, res, next) {
  console.log(req.session);

  if (!req.session.user) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.setHeader('WWW-Authenticate', 'Basic');
      next(createError(401, 'You are not authenticated!'));
    } else {
      const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');

      if (username === 'admin' && password === 'password') {
        req.session.user = 'admin';
        next();
      } else {
        next(createError(401, `${username}:${password} is not an authorized user!`));
      }
    }
  } else {
    if (req.session.user === 'admin') {
      next();
    } else {
      next(createError(401, `${req.signedCookies.user} is not an authorized user!`));
    }
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
