/**
 * Created by lenovo on 2016/8/31.
 */
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var DB_STR = 'mongodb://localhost:27017/blog';
var ObjectId = require('mongodb').ObjectId;

//前台博客页面:
router.get('/',function(req,res){
    var id = req.query.id;
    MongoClient.connect(DB_STR,function(err,db){
        if (err) throw err;
        var c = db.collection('posts');
        c.find({_id:ObjectId(id)}).toArray(function(err,docs){
            if(err) throw err;
            var c1 = db.collection('cats');
            c1.find().toArray(function(err,docs1){
                res.render('home/article',{data:docs[0],data1:docs1});
            });
        });
    });
});

module.exports = router;