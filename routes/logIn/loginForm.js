var express = require('express');
var router = express.Router();

/* Get loginForm page */
router.get('/', function(req, res, next) {

  var session = req.session;

  if(session.email != null){
    res.render('index', {email : sesion.email, user_no : session.member_no});
  }else{
    res.render('logIn/loginForm');
  }
  // res.render('logIn/loginForm', {title : '로그인 화면', id : session.id, logined : session.logined});
});


module.exports = router
