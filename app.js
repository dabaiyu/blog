var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');       //!!!!!!!!!!!!!!!!!!!!!!!!

var routes = require('./routes/home/index');
var users = require('./routes/admin/users');
var posts = require('./routes/home/posts');     //载入前台posts.js模块！！！！！！
var admin = require('./routes/admin/admin');   //载入后台admin.js模块！！！！！！
var cats = require('./routes/admin/cats');      //载入后台cats.js模块！！！！！！
var article = require('./routes/admin/posts');   //载入后台posts.js模块


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
app.engine('html',require('ejs').__express);    //设置模版引擎为html!!!!!!
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'views/admin')));   //加载后台页面的静态资源(路径:views/admin)！！！！！！

app.use(session({             //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  secret:'andy',
  reseve:false,
  saveUninitialized:true,
  cookie:{}  //maxAge:1000*20：session失效时长，不填则是默认的浏览器关闭时失效
}));

app.use('/', routes);
app.use('/posts',posts);            //使用posts中间件！！！！！！

app.use('/admin/index',checkLogin);
app.use('/admin/index',admin);      //使用admin中间件！！！！！！

app.use('/admin/cats',checkLogin);
app.use('/admin/cats',cats);        //使用cats中间件！！！！！！

app.use('/admin/posts',checkLogin);
app.use('/admin/posts',article);    //使用article中间件！！！！！！

app.use('/admin/users',users);

//编写一个中间件，判断用户是否有权限访问
function checkLogin(req,res,next){
  //判断用户是否登录，看session是否有登录的标志
  if (!req.session.isLogin){   //调用express-session中间件
    //没有登录，跳转到登录页面
    res.redirect('/admin/users/login');
  }
  //调用next，将控制权转交
  next()
}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
