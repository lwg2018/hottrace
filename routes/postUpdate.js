var express = require('express');
var router = express.Router();
var mssql = require('mssql');
var config = {
    user: 'sa',
    password: 'talk1234!',
    server: '223.194.46.212', 
    database: 'kwudb',
    port: 82
}

router.get('/', function(req, res, next) {  
    mssql.close()
    mssql.connect(config,function(err){
        if(err) {
            console.log("connection error : ",err);
        }
        else{
            console.log("-----connection success for UPDATE--------");
            var pno = req.query.post_no;
            
            //var query = "p_tsh_post_read_detail '" + pno + "'";
            
            //console.log(req);
            //console.log(pno);
            
            var request = new mssql.Request();
            request.query("p_tsh_post_read_detail '" + pno + "'", function(err,recordset){
            if(err) console.log("query error : ",err);
            //recordset의 recordset이 query결과를 가져온 것.
            console.log("Update SQL post_no -> " + pno);
            res.render('postUpdate',{title:'글 수정',rows:recordset.recordset});
            });
        }
    });
});

router.post('/', function(req,res,next){
    mssql.close();
    var pno = req.body.post_no;
    var ptitle = req.body.post_title || "제목 없음...";
    var pcontents = req.body.post_contents || "내용 없음...";
    var cno = req.body.cat_no || "2";
    var query = "p_tsh_post_update '" + pno + "','" + ptitle + "','" + pcontents + "','ALL','" + cno + "'";
    
    console.log("Post update -> ",query);
    
    mssql.connect(config,function(err){
        if(err) console.log("connection error : ",err);
        else{
            console.log("-----connection success for UPDATE--------");
            var request = new mssql.Request();
            request.query(query, function(err,recordset){
            if(err) console.log("query error : ",err);
                res.redirect('/post_select');
            });
        }    
    });
})
module.exports = router;
