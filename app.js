var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var express = require('express')
const cookieSession = require('cookie-session')

//处理前端跨域
var cors = require('cors')

var usersRouter = require('./routes/users');
var positionsRouter = require('./routes/positions');

var loginRouter = require('./routes/login');


var app = express();
app.use(cors({
            credentials: true, 
            origin: 'http://localhost:8080', // web前端服务器地址
            // origin: '*' // 这样会出错
        }))
//设置cookie-session
app.set('trust proxy', 1)
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use("/admin", (req, res, next) => {
//   let isLogin = req.session.username
//   if (isLogin) {
//     next()
//   } else {
//     res.json({
//       data: {
//         ret: false,
//         errorCode: 1,
//         message: "请先登录"
//       }
//     })

//   }
// })
app.use("/api", loginRouter)
app.use('/admin/api/users', (req, res, next) => {
  //或者用middleware的auth中间件
  let isLogin = req.session.username
  if (isLogin) {
    next()
  } else {
    res.json({
      data: {
        ret: false,
        errorCode: 1,
        message: "请先登录"
      }
    })
  }
}, usersRouter);
app.use('/admin/api/positions', (req, res, next) => {
  //或者用middleware的auth中间件
  let isLogin = req.session.username
  if (isLogin) {
    next()
  } else {
    res.json({
      data: {
        ret: false,
        errorCode: 1,
        message: "请先登录"
      }
    })
  }
}, positionsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app
