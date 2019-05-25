var express = require('express');
var router = express.Router();
var MsSql = require('mssql');

/* Get Login page */
router.get('/', function(req, res, next) {
    if(req.session.logined == true){
//        req.session.city = 'London'
//        req.session.circleClicked = false
        res.redirect('/main');
        //res.render('main', {result: true});
    }
    else{
        res.render('logIn/loginForm');
    }
});

router.post('/', function(req, res, next) {
    var sqlConfig = {
    user: process.env.DB_TALK_USER,
    password: process.env.DB_TALK_PASSWORD,
    server: process.env.DB_HOST,
    port: process.env.SERVER_PORT,
    database: process.env.DB_TALK_NAME
    };
    
  member_email = req.body.email;
  member_pwd = req.body.password;
    
  var strSQL = "select * from " + process.env.DB_TALK_NAME + ".dbo.htMember where email='" + member_email + "' and password='" + member_pwd + "'";
  MsSql.connect(sqlConfig, function(err) {
    var request = new MsSql.Request();
    
    request.query(strSQL, (err, row) => {
      var memberInfo = row.recordset[0];
      if(row.rowsAffected != 0){
        var sess = req.session;
        sess.email = memberInfo.email;
        sess.userage = memberInfo.age;
        sess.username = memberInfo.name;
        sess.logined = true;
        sess.member_no = memberInfo.member_no;
        //sess.circleClicked = false

        // console.log('member_no_sess : ' + sess.member_no);
        //sess.city = 'London'
        res.redirect('/main');
        //res.render('main', {result: true});
        // res.render('index', {member_no : sess.member_no});
      }else{
        res.render('logIn/loginForm', {login: false});
      }
      MsSql.close();
    });
  });

  // MsSql.connect(sqlConfig, function(err) {
  //   var request = new MsSql.Request();
  //   request.stream = true;
  //
  //   request.query(strSQL);
  //
  //   request.on('row', function(row) {
  //     // console.log(Object.keys(row));
  //     // console.log(Object.values(row));
  //     // console.log(typeof row.member_email);
  //     if(row.member_email != 'undefined'){
  //       var sess = req.session;
  //       sess.member_no = row.member_no;
  //       sess.logined = true;
  //
  //       // console.log('member_no_sess : ' + sess.member_no);
  //       res.render('index');
  //       // res.render('index', {member_no : sess.member_no});
  //     }else{
  //       return res.render('logIn/loginForm', {result: false});
  //     }
  //   });
  //
  //   request.on('error', function(err) {
  //     console.log('error');
  //     console.log(err);
  //   });
  //
  //   request.on('done', function(returnValue) {
  //     // console.log('returnValue : ' + Object.values(returnValue.output));
  //     MsSql.close();
  //     console.log('SQL Closed');
  //   });
  // });
});

module.exports = router
