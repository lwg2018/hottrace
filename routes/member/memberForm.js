var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('member/memberForm', {title:'회원가입양식'});
});

module.exports = router;
