/**
 * Created by lenovo on 2016/8/31.
 */
//后台首页面路由
var express = require('express');
var router = express.Router();

//后台首页面路由处理
router.get('/',function(req,res){
    //渲染后台index.html模版文件
    res.render('admin/admin');
});

module.exports = router;