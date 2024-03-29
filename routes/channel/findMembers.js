var express = require('express');
var router = express.Router();
var MsSql = require('mssql');

/* Get Chatting List page */
router.get('/', function(req, res, next) {

  var sess = req.session;


var sqlConfig = {
    user: process.env.DB_TALK_USER,                                                                              
    password: process.env.DB_TALK_PASSWORD,
    server: process.env.DB_HOST,
    port: process.env.SERVER_PORT,
    database: process.env.DB_TALK_NAME
};

    var chatroom_no = req.query.chat_no;
    if(chatroom_no == undefined) chatroom_no = '0';
    var member_no = parseInt(sess.member_no);

    var strSQL = "p_uw_friend_read '" + member_no + "', " + chatroom_no;
    console.log(strSQL);

    MsSql.connect(sqlConfig, function(err) {
      var request = new MsSql.Request();

      request.query(strSQL, (err, rows) => {
        res.render('channel/findMembers', {chatroom_no : chatroom_no, friends : rows.recordset});
        MsSql.close();
      });
    });
});

module.exports = router;
