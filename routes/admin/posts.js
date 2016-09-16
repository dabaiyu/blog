/**
 * Created by lenovo on 2016/8/31.
 */
//后台文章管理路由处理
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var DB_STR = 'mongodb://localhost:27017/blog';

//页面一：显示文章主列表页
router.get('/',function(req,res){
    MongoClient.connect(DB_STR,function(err,db){
        if (err) throw err;
        var c = db.collection('posts');
        c.find().toArray(function(err,docs){
            if (err) throw err;
            //渲染视图页面，并传递数据
            res.render('admin/article_list',{data:docs});
        });
    });
});

//页面二：添加文章页面
router.get('/add',function(req,res){
    MongoClient.connect(DB_STR,function(err,db){
        if (err) throw err;
        var c = db.collection('cats');
        c.find().toArray(function(err,docs){
            if (err) throw err;
            //渲染视图页面，并传递数据
            res.render('admin/article_add',{data:docs});
        });
    });

});


//处理添加文章动作(post表单提交)
router.post('/add',function(req,res){
    //获取表单内容
    var cat = req.body.cat;
    var title = req.body.title;
    var summary = req.body.summary;
    var content = req.body.content;
    //获取当前时间
    var time = new Date().toLocaleString();
    var post = {
        'cat':cat,
        'title':title,
        'summary':summary,
        'content':content,
        'time':time
    }
    //插入数据库
    MongoClient.connect(DB_STR,function(err,db){
        if (err) throw err;
        var c = db.collection('posts');
        c.insert(post,function(err,result){
            if (err) throw err;
            res.send('添加文章成功，<a href="/admin/posts">返回文章列表</a>');
        });
    });
});

module.exports = router;