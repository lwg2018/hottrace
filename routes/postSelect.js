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
        else
        {
            console.log("-----connection for post select success--------");
            var request = new mssql.Request();
            request.query('p_tsh_post_read', function(err,recordset){
              if(err) console.log("query error : ",err);
              //recordset의 recordset이 query결과를 가져온 것.
              //console.log(recordset.recordset);
              res.render('postSelect',{title:'글 목록',rows:recordset.recordset});
            });
        }
    });
});
module.exports = router;
