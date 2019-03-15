var express = require('express');
var router = express.Router();
var MsSql = require('mssql');

/* Get Chatting List page */
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

    member_no = parseInt(sess.member_no);

    var strSQL = "p_uw_chatroom_member_read " + member_no;

    MsSql.connect(sqlConfig, function(err) {
      var request = new MsSql.Request();

      request.query(strSQL, (err, rows) => {
        // if(err == 'ETIMEOUT') console.log('ETIMEOUT');

        // console.log(Object.keys(rows));
        // cosnole.log(Object.values(rows));
        res.render('channel/channelList', {channels : rows.recordset});
        MsSql.close();
      });
    });
  }else{
    res.redirect('/')
  }
});

module.exports = router;
