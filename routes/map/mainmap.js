var express = require('express');
var router = express.Router();
var MsSql = require('mssql');

var sqlConfig = {
    user: process.env.DB_TALK_USER,                                                                              
    password: process.env.DB_TALK_PASSWORD,
    server: process.env.DB_HOST,
    port: process.env.SERVER_PORT,
    database: process.env.DB_TALK_NAME
};

/* Get Login page */
router.get('/', function(req, res, next) {
    //req.session.city = "London"
    if(req.session.logined == true){
         res.render('start');
     }else{
         res.redirect('/login');
     }
});

//router.post('/setfilter', function(req, res, next) {
//    //req.session.city = "London"
//    if(req.session.logined == true){
//        if(req.body.type == 0){
//            res.send({result:true, day: clinkset, count: count});
//            console.log(req.session.d_or_n);
//        }else{
//         req.session.nationality = req.body.nationality;
//            console.log(req.session.nationality);
//        }
//     }else{
//         res.redirect('/login');
//     }
//});

router.get('/London', function(req, res, next) {
    req.session.city = "London";
    //req.session.d_or_n = "all";
    //req.session.nationality = "all"
    var strSQL = "select * from " + process.env.DB_TALK_NAME + ".dbo.htCircle where city='" + req.session.city + "'";
    
    MsSql.connect(sqlConfig, function(err) {
    var request = new MsSql.Request();
    
    request.query(strSQL, (err, row) => {
      if(err){
          res.render('error', {result: false});
      }
        if(req.session.logined == true){
            res.render('London', {recordset: row.recordset});
        }
      MsSql.close();
      });
    });
});

router.get('/Berlin', function(req, res, next) {
    req.session.city = "Berlin"
    //req.session.d_or_n = "all";
    //req.session.nationality = "all"
    var strSQL = "select * from " + process.env.DB_TALK_NAME + ".dbo.htCircle where city='" + req.session.city + "'";
    
    MsSql.connect(sqlConfig, function(err) {
    var request = new MsSql.Request();
    
    request.query(strSQL, (err, row) => {
      if(err){
          res.render('error', {result: false});
      }
        if(req.session.logined == true){
            res.render('berlin', {recordset: row.recordset});
        }
      MsSql.close();
      });
    });
});

router.get('/Paris', function(req, res, next) {
    req.session.city = "Paris"
    //req.session.d_or_n = "all";
    //req.session.nationality = "all"
    var strSQL = "select * from " + process.env.DB_TALK_NAME + ".dbo.htCircle where city='" + req.session.city + "'";
    
    MsSql.connect(sqlConfig, function(err) {
    var request = new MsSql.Request();
    
    request.query(strSQL, (err, row) => {
      if(err){
          res.render('error', {result: false});
      }
        if(req.session.logined == true){
            res.render('paris', {recordset: row.recordset});
        }
      MsSql.close();
      });
    });
});

router.get('/Manchester', function(req, res, next) {
    req.session.city = "Manchester"
    //req.session.d_or_n = "all";
    //req.session.nationality = "all"
    var strSQL = "select * from " + process.env.DB_TALK_NAME + ".dbo.htCircle where city='" + req.session.city + "'";
    
    MsSql.connect(sqlConfig, function(err) {
    var request = new MsSql.Request();
    
    request.query(strSQL, (err, row) => {
      if(err){
          res.render('error', {result: false});
      }
        if(req.session.logined == true){
            res.render('manchester', {recordset: row.recordset});
        }
      MsSql.close();
      });
    });
});

module.exports = router
