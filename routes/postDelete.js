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
        if(err) console.log("connection error : ",err);
        else{
            console.log("-----connection success for DELETE--------");
            var pno = req.query.post_no;
            
            var request = new mssql.Request();
            request.query("p_tsh_post_delete '" + pno + "'", function(err,recordset){
                
               if(err) {
                   console.log("query error : ",err);
               }
               else {
                   console.log("Deleted... post_no -> " + pno);
                   res.redirect('/post_select');
               }
                
            });
        }
    });
});

module.exports = router;
