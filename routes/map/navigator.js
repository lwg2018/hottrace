var express = require('express');
var router = express.Router();

/* Get Login page */
router.get('/', function(req, res, next) {
  res.render('map/navigator');
});

module.exports = router
