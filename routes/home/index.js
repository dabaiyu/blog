var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var DB_STR = 'mongodb://localhost:27017/blog';

//主页
router.get('/', function(req, res, next) {
  MongoClient.connect(DB_STR,function(err,db){
    if (err) throw err;
    //获取文章
    var c = db.collection('posts');
    c.find().toArray(function(err,docs){
      if(err) throw err;
      //获取分类
      var c1 = db.collection('cats');
      c1.find().toArray(function(err,docs1){
        res.render('home/index', {data:docs,data1:docs1});
      });
    });
  });
});

module.exports = router;
