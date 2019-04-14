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
    var strSQL = "select * from " + process.env.DB_TALK_NAME + ".dbo.htCircle where city='" + req.session.city + "'";
    
    MsSql.connect(sqlConfig, function(err) {
    var request = new MsSql.Request();
    
    request.query(strSQL, (err, row) => {
      if(err){
          res.render('logIn/loginForm', {result: false});
      }
        if(req.session.logined == true){
            res.render('main', {recordset: row.recordset});
        }
        // console.log('member_no_sess : ' + sess.member_no);
        // res.render('index', {member_no : sess.member_no});

      MsSql.close();
      });
    });
});

//router.post('/', function(req, res, next) {
//  var strSQL = "select * from " + process.env.DB_TALK_NAME + ".dbo.htMember where email='" + member_email + "' and password='" + member_pwd + "'";
//  MsSql.connect(sqlConfig, function(err) {
//    var request = new MsSql.Request();
//    
//    request.query(strSQL, (err, row) => {
//      var memberInfo = row.recordset[0];
//      if(row.rowsAffected != 0){
//        var sess = req.session;
//        sess.member_no = memberInfo.email;
//        sess.logined = true;
//
//        // console.log('member_no_sess : ' + sess.member_no);
//        res.render('main', {result: true});
//        // res.render('index', {member_no : sess.member_no});
//      }else{
//        res.render('logIn/loginForm', {result: false});
//      }
//      MsSql.close();
//    });
//  });
//});

module.exports = router
