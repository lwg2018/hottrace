var express = require('express');
var router = express.Router();
var MsSql = require('mssql');

router.get('/', function(req, res, next) {
  var sess = req.session;

  if(sess.logined){
    var sqlConfig = {
      user: process.env.DB_KWU_USER,
      password: process.env.DB_KWU_PASSWORD,
      server: process.env.DB_HOST,
      port: process.env.SERVER_PORT,
      database: process.env.DB_KWU_NAME
    };

    var member_no = parseInt(sess.member_no);

    var strSQL = "p_uw_friend_read '" + member_no + "'";

    MsSql.connect(sqlConfig, function(err) {
      var request = new sql.Request();

      request.query(strSQL, (err, rows) => {
        // if(err == 'ETIMEOUT') console.log('ETIMEOUT');

        // console.log(Object.keys(rows));
        // console.log(Object.values(rows));
        res.render('channel/chatMembers', {friends : rows.recordset});
        MsSql.close();
      });
    });
  }else{
    res.redirect('/');
  }
});

module.exports = router;
