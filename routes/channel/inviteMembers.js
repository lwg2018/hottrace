var express = require('express');
var router = express.Router();
var MsSql = require('mssql');

/* 이미 있는 채팅방에 멤버를 초대 */
router.get('/', function(req, res, next) {
  var sess = req.session;
  var member_no = parseInt(sess.member_no);
//var member_no = parseInt('10');
 // if(sess.logined){

    var chatroom_no = req.query.chatroom_no;
    console.log(chatroom_no);
    var friends = req.query.friends.split(',');
    console.log("member_no : " + member_no);
    asyncInviteMembers(chatroom_no, friends, member_no).then(chatroom_title => {
      res.redirect('chatting?chatroom_no='+chatroom_no+'&chatroom_title='+chatroom_title);
    });

 // }else{
  //  res.redirect('/')
  //}
});

// 새로운 채팅방 개설
router.get('/openChannel', function(req, res, next){
  var sess = req.session;
  //if(sess.logined){

    var member_no = parseInt(sess.member_no);
    //var member_no = 10;
    var friends = req.query.friends.split(',');
    createChannel(0, member_no).then(data => {
      asyncInviteMembers(data, friends, member_no).then(chatroom_title => {
        res.render('channel/secretChannel', {chatroom_no : data, messages : {}, chatroom_title : chatroom_title});
      });
    });

  //}
//    else{
//    res.redirect('/')
//  }
});

async function createChannel(chatroom_no, member_no){
    return new Promise(function(resolve, reject){
var sqlConfig = {
    user: process.env.DB_TALK_USER,                                                                              
    password: process.env.DB_TALK_PASSWORD,
    server: process.env.DB_HOST,
    port: process.env.SERVER_PORT,
    database: process.env.DB_TALK_NAME
};
    MsSql.connect(sqlConfig).then(result => {
      var request = new MsSql.Request();
      var chatroom_no = 0;
      console.log("before generate");

//    request.execute("p_uw_chatroom_generate '10'")
//      .then(result => {
//        console.log("#######################");
//        chatroom_no = result.recordset[0].chatroom_no;
//        console.log("chatroom no is : " + chatroom_no);
//        resolve(chatroom_no);
//        MsSql.close();
//      }).catch(request_err => {
//        console.log("&&&&&&&&&&&&&&&&&&&");
//        // ...sql err
//        console.log('execute err : ' + request_err);
//        MsSql.close();
//        reject('reject 되었습니다.');
//      })
        var strSQL = "p_uw_chatroom_generate '" + member_no + "'"
      request.query(strSQL, (err, rows) => {
        console.log("#######################");
        chatroom_no = rows.recordset[0].chatroom_no;
        console.log("chatroom no is : " + chatroom_no);
        resolve(chatroom_no);
        MsSql.close();
      });
    });
  });
  // var num = await insertMember(chat_no, member_no);
  return chatroom_no;
}

async function asyncInviteMembers(chatroom_no, friends, owner_no) {
  // var num = chatroom_no;
  var chatroom_title;
chatroom_title = await insertMember(chatroom_no, owner_no, owner_no);
  for(var i = 0; i < friends.length; i++){
      console.log("dddd"+friends[i]);
    chatroom_title = await insertMember(chatroom_no, friends[i], owner_no);
  }
  return chatroom_title;
}

function insertMember(chatroom_no, member_no, owner_no) {
    console.log("!");
    console.log(chatroom_no);
    console.log(member_no);
  return new Promise(function(resolve, reject){
var sqlConfig = {
    user: process.env.DB_TALK_USER,                                                                              
    password: process.env.DB_TALK_PASSWORD,
    server: process.env.DB_HOST,
    port: process.env.SERVER_PORT,
    database: process.env.DB_TALK_NAME
};
    MsSql.connect(sqlConfig).then(result => {
      var request = new MsSql.Request();

      request.input('p_chatroom_no', MsSql.Int, chatroom_no);
      request.input('p_member_no', MsSql.Int, member_no);
      request.input('p_owner_no', MsSql.Int, owner_no);
        console.log("owenr_no: " + owner_no);
      request.execute('p_uw_chatroom_member_insert')
        .then(result => {
          
          var chatroom_title = result.recordset[0].chatroom_title;
          MsSql.close();
          resolve(chatroom_title);
        }).catch(request_err => {
          // ...sql err
          console.log('execute err : ' + request_err);
          MsSql.close();
          reject('reject 되었습니다.');
        });

      // request.execute('p_uw_chatroom_member_insert');
      // console.log('request completed.');
      // MsSql.close();
    // }).catch(connect_err => {
    //   //connection err
    //   console.log('conntion err');
    //   reject('reject 되었습니다.');
    // });
  });
});
}

module.exports = router;
