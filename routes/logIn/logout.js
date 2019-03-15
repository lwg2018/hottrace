var express = require('express');
var router = express.Router();

/* Get Logout page */
router.get('/', function(req, res, next) {
  req.session.destroy();

  res.redirect('index', {title : 'Express', id : null ,logined : false});
});

module.exports = router
