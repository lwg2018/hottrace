var express = require('express');
var router = express.Router();
var sql = require('mssql');

router.get('/', function(req, res, next) {

  var sqlConfig = {
    user: 'sa',
    password: 'talk1234!',
    server: '223.194.46.212',
    port: 82,
    database: 'talkdb'
  };

  var x_center = req.query.x_center;
  var y_center = req.query.y_center;

  // console.log('x_center : ' + x_center);
  // console.log('y_center : ' + y_center);

  // sql.connect(sqlConfig, function (err) {
  //   var request = new sql.Request();
  //   request.stream = true;
  //
  //   // request.query('SHOW TABLES');
  //   // request.query('SELECT word_grid FROM [gmap_wordgrid] WHERE latgrid_no=39596 AND longrid_no=117470');
  //   // request.query('SELECT word_grid FROM [gmap_wordgrid] WHERE latgrid_no="' + x_center + '" AND longrid_no="' + y_center + '"');
  //
  //   // console.log(request);
  //
  //   request.on('row', function(row) {
  //     // console.log(row.word_grid);
  //     // res.send(row.word_grid);
  //     res.send('활성.서벽.금빛');
  //   });
  //
  //   request.on('error', function(err) {
  //       console.log(err);
  //   });
  //
  //   request.on('done', function(returnValue) {
  //       console.log('Data End');
  //   });
  // });
  res.send('활성.서벽.금빛');


});

module.exports = router;
