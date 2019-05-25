var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

router.get('/', function(req, res, next) {
  var sess = req.session

  if(sess.logined){
    // CONNECT TO MONGODB SERVER
    var client = new MongoClient(process.env.DB_MONGO_URL, { useNewUrlParser: true });

    client.connect(function(err){
      assert.equal(null, err);
      console.log("Connected successfully to Mongodb");

      var db = client.db(process.env.DB_MONGO_NAME);
        console.log(db);
    //db.authenticate('sa', 'port27017', function(err,res){
      var collection = db.collection('Messages');

      var chatroom_no = parseInt(req.query.chatroom_no);
       var member_no = parseInt(sess.member_no);
        //var member_no = parseInt('10');
      var chatroom_title = req.query.chatroom_title;

      collection.find({channel_no: chatroom_no}).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");

        res.render('channel/secretChannel', {member_no : member_no, chatroom_no : chatroom_no, messages : docs, chatroom_title : chatroom_title});
      });

      client.close();
    //});
    });
  }else{
    res.redirect('/');
  }
});

module.exports = router;
