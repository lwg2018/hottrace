var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var moment = require('moment');

router.post('/', function(req, res, next) {

  var sess = req.session

  //if(sess.logined){
    // CONNECT TO MONGODB SERVER
    var client = new MongoClient(process.env.DB_MONGO_URL, { useNewUrlParser: true });

    client.connect(function(err){
      assert.equal(null, err);
      console.log("Connected successfully to Mongodb");

      var db = client.db(process.env.DB_MONGO_NAME);
      var collection = db.collection('Messages');

      var channel_no = parseInt(req.body.chatroom_no);
      var member_no= parseInt(req.body.member_no);
      var message = req.body.message;
      var date = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));

      var msgDoc = {channel_no : channel_no, member_no : member_no, sendedAt : date, message: message};

      collection.insert(msgDoc, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted document into the Messages");

        res.send({success : 'success', sendedAt : date});
      });

      client.close();
    });
  //}
//else{
//    res.redirect('/');
//  }
});

module.exports = router;
