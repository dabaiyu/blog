var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var DB_STR = 'mongodb://localhost:27017/blog';
var session = require('express-session');   //！！！！！！！！！！！！！！！！

router.use('/login',checkNotLogin);

//用户登录页面：
router.get('/login', function(req, res, next) {
  res.render('admin/login');
});

//处理用户登录动作
router.post('/signin',function(req,res){
  //获取用户名和密码
  var username = req.body.username;
  var pwd = req.body.pwd;
  console.log(pwd);
  //到数据库比对查询
  MongoClient.connect(DB_STR,function(err,db){
    if (err) throw err;
    var c = db.collection('users');
    c.find({username:username,pwd:pwd}).toArray(function(err,docs){
      if (err) throw err;
      //docs查询的结果[],或[对象]
      if (docs.length){
        //登录成功，
        req.session.isLogin = true;
        res.redirect('/admin/index');
      }else{
        //登录失败
        res.redirect('/admin/users/login');
      }
    });
  });
});

//处理用户注销事件
router.get('/logout',function(req,res){
  req.session.isLogin = false;
  res.redirect('/admin/users/login');
});

//判断用户是否登录了
function checkNotLogin(req,res,next){
  if(req.session.isLogin){
    //如果已经登录了，跳转到原先的页面
    res.redirect('back');
  }
  next();
}

module.exports = router;
