var express = require('express');
var router = express.Router();
var mssql = require('mssql');
var config = {
    user: 'sa',
    password: 'talk1234!',
    server: '223.194.46.212', 
    database: 'kwudb',
    port: 82,
    encrypt: false
}

router.get('/', function(req, res, next) {  
    res.render('postInsert',{title:'글 입력'});
});

router.post('/', function(req,res,next){
    mssql.close();
    var ptitle = req.body.post_title || "제목 없음...";
    var pcontents = req.body.post_contents || "내용 없음...";
    var cno = req.body.cat_no || "2";
    var query = "p_tsh_post_insert '" + ptitle + "','" + pcontents + "','ALL','" + cno + "','1'";
    
    console.log("Post insert -> ",query);
    
    mssql.connect(config,function(err){
        if(err) console.log("connection error : ",err);
        else{
            console.log("-----connection success--------");
            var request = new mssql.Request();
            request.query(query, function(err,recordset){
            if(err) console.log("query error : ",err);
                res.redirect('/post_select');
            });
        }    
    });
});

module.exports = router;
