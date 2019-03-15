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

    var chatroom_no = req.query.chatroom_no;
    if(chatroom_no == undefined) chatroom_no = '0';
    var member_no = parseInt(sess.member_no);

    var strSQL = "p_uw_chatroom_exit " + chatroom_no + ", " + member_no;
    console.log(strSQL);

    MsSql.connect(sqlConfig, function(err) {
      var request = new MsSql.Request();

      request.query(strSQL, (err, rows) => {

        strSQL = "p_uw_chatroom_member_read " + member_no;

          var request = new MsSql.Request();

          request.query(strSQL, (err, rows) => {
            res.render('channel/channelList', {channels : rows.recordset});
              MsSql.close();

        });
        // if(err == 'ETIMEOUT') console.log('ETIMEOUT');

        // console.log(Object.keys(rows));
        // console.log(Object.values(rows));
      });
    });
  }else{
    res.redirect('/')
  }
});

module.exports = router;
