/**
 * Created by lenovo on 2016/8/31.
 */
//后台分类管理路由
var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;   //引入mongodb
var DB_STR =  'mongodb://localhost:27017/blog';
var ObjectId = require('mongodb').ObjectId;

//页面一：分类页面
router.get('/',function(req,res){
    //连接数据库，查询cats集合，获取内容
    MongoClient.connect(DB_STR,function(err,db){
        if (err) throw err;
        var c = db.collection('cats');
        c.find().toArray(function(err,docs){
            if (err) throw err;
            //渲染试图页面，传递到视图中
            res.render('admin/category_list',{data:docs});
        });
    });
});

//页面二：分类添加页面
router.get('/add',function(req,res){
    res.render('admin/category_add');
});

//处理添加分类动作
router.post('/add',function(req,res){
    //获取表单提交的数据
    var title = req.body.title;
    var sort = req.body.sort;
    //验证环节，暂时省略
    //将数据保存到数据库中,并完成提示并跳转
    MongoClient.connect(DB_STR,function(err,db){
        if(err) throw err;
        var c = db.collection('cats');
        c.insert({title:title,sort:sort},function(err,result){
            if(err) throw err;
            res.send('添加分类成功<a href="/admin/cats">查看列表</a>');
        });
    });
});

//页面三：编辑分类页面
router.get('/edit',function(req,res){
    //获取查询字符串
    var id = req.query.id;
    //当前对应数据
    MongoClient.connect(DB_STR,function(err,db){
        if (err) throw err;
        var c = db.collection('cats');
        c.find({_id:ObjectId(id)}).toArray(function(err,docs){
            if (err) throw err;
            res.render('admin/category_edit',{data:docs[0]});  //取出数组中的第一个
        });
    });
});

//处理更新分类动作(post表单提交)
router.post('/edit',function(req,res){
    //获取表单数据
    var title = req.body.title;
    var sort = req.body.sort;
    var id = req.body.id;
    //完成更新操作
    MongoClient.connect(DB_STR,function(err,db){
        if (err) throw err;
        var c = db.collection('cats');
        c.update({_id:ObjectId(id)},{$set:{title:title,sort:sort}},function(err,result){
            if (err) throw err;
            res.send('更新成功<a href="/admin/cats">返回列表</a>');
        });
    });
});

//处理删除分类动作
router.get('/delete',function(req,res){
    //获取传递过来的ID参数
    var id = req.query.id;
    //在数据库中使用remove删除
    MongoClient.connect(DB_STR,function(err,db){
        if (err) throw err;
        var c = db.collection('cats');
        c.remove({_id:ObjectId(id)},function(err,result){
            if (err) throw err;
            res.send('删除成功<a href="/admin/cats">返回列表</a>');
        });
    });
});

module.exports = router;