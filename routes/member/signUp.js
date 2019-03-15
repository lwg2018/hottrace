// var express = require('express');
// var router = express.Router();
// var mongoose    = require('mongoose');
// var moment = require('moment');
//
// /* Get login page */
// router.post('/', function(req, res, next) {
//   // CONNECT TO MONGODB SERVER
//   mongoose.connect('mongodb://localhost:27017/chat_db', { useNewUrlParser: true });
//   var db = mongoose.connection;
//
//   db.on('error',  console.error.bind(console, 'connection error:'));
//
//   db.once('open', function(){
//
//     var name = req.body.name;
//     var id = req.body.id;
//     var pwd = req.body.pwd;
//     // var date = dateUtils.toFormat('YYYY-MM-DD HH24:MI:SS');
//
//     var date = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
//     console.log("date : " + date);
//
//     var memberObj = {user_name : name, user_id : id, password : pwd, creation : date};
//
//     db.collection('Members').insertOne(memberObj, function(err, member) {
//       if (err) throw err;
//
//       console.log("Inserted Member...");
//
//       req.session.logined = true;
//       req.session.id = id;
//
//       res.render('index', { title: 'Express', session : req.session });
//   });
//
//   db.close();
//
//       //
//       // var memberSchema = mongoose.Schema({
//       //   userName: 'string',
//       //   id: 'string',
//       //   password: 'string'
//       // });
//       //
//       // var Member = mongoose.model('Members', memberSchema);
//       //
//       // var member = new Member();
//       // member.userName = req.body.name;
//       // member.id = req.body.id;
//       // member.password = req.body.pwd;
//       //
//       // member.save(function(err, data){
//       //   if(err) return console.error(err);
//       // });
//   });
// });
//
// module.exports = router
