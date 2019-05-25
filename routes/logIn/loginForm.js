var express = require('express');
var router = express.Router();

/* Get loginForm page */
router.get('/', function(req, res, next) {

  var session = req.session;

//  if(session.logined != null){
//    res.redirect('/main');
//  }else{
    if(req.session.logined == true){
        res.render('intro', {logined: true});
    }else{
        res.render('intro', {logined: false});
    }
 // }
  // res.render('logIn/loginForm', {title : '로그인 화면', id : session.id, logined : session.logined});
});


module.exports = router
