var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
require('dotenv').config();

// 모듈드 영역
// var indexRouter = require('./routes/index');
var selectRouter = require('./routes/postSelect');
var insertRouter = require('./routes/postInsert');
var deleteRouter = require('./routes/postDelete');
var updateRouter = require('./routes/postUpdate');

// var memberFormRouter = require('./routes/member/memberForm');
// var signUpRouter = require('./routes/member/signUp');
var loginFormRouter = require('./routes/logIn/loginForm');
var loginRouter = require('./routes/logIn/login');
var logoutRouter = require('./routes/logIn/logout');

var joinRouter = require('./routes/member/join');
var profileRouter = require('./routes/member/profile');

//채팅 관련 Router
var channelListRouter = require('./routes/channel/channelList');
var channelRouter = require('./routes/channel/channel');
var messageRouter = require('./routes/channel/sendMsg');
var chattingMembersRouter = require('./routes/channel/chatMembers');
var findMembersRouter = require('./routes/channel/findMembers');
var inviteMembersRouter = require('./routes/channel/inviteMembers');
var exitChatRoomRouter = require('./routes/channel/exitChatRoom');
var addMembersRouter = require('./routes/channel/addMembers');

//지도 관련 Router
var navigatorRouter = require('./routes/map/navigator');
var markerRouter = require('./routes/map/marker');
var mainmapRouter =require('./routes/map/mainmap');
var circleLinkRouter = require('./routes/map/get_circlelink');

//머신러닝 Router
var machineLearningRouter = require('./routes/machine_learning/recommand_place');

//게시판 Router
//var writeBoard = require('./route/board/write_board');

var app = express();

/*
  채팅을 위해 http를 socket.io로 업그레이드
*/

app.io = require('socket.io')();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  key: 'sid', // 세션키
  secret: 'secret', // 비밀키
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 // 쿠키 유효기간 1시간
  }
}))

app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/post_select',selectRouter);
app.use('/post_insert',insertRouter);
app.use('/post_delete',deleteRouter);
app.use('/post_update',updateRouter);
// app.use('/chat',chatRouter);
// app.use('/chatRoomMake',chatRoomMakeRouter);
// app.use('/chatRoom',chatRoomJoinRouter);

// app.use('/memberForm', memberFormRouter);
// app.use('/signUp', signUpRouter);
app.use('/', loginFormRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/join', joinRouter);
app.use('/profile', profileRouter);

app.use('/channels', channelListRouter);
app.use('/chatting', channelRouter);
app.use('/chatMembers', chattingMembersRouter);
app.use('/findMembers', findMembersRouter);
app.use('/inviteMembers', inviteMembersRouter);
app.use('/sendMsg', messageRouter);
app.use('/exitChatRoom', exitChatRoomRouter);
app.use('/addMembers', addMembersRouter);

app.use('/map/navigator', navigatorRouter);
app.use('/map/marker', markerRouter);
app.use('/main', mainmapRouter);
app.use('/getCircleLink', circleLinkRouter);

app.use('/machineLearning/recommand_place', machineLearningRouter);

//app.use('/board', boardRouter);
// app.use('/chatTest', chatTest);
// app.use('/chatRoomTest', chatRoomJoinTest);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/*
  네임스페이스 적용
*/
const chatRoomNSP = app.io.of('chatChannel');

chatRoomNSP.on('connection', function(socket){
  socket.on('joinRoom', function(data){;
    socket.join('Room-' + data.chatroom_no); //룸입장
    console.log('JOIN ROOM LIST', chatRoomNSP.adapter.rooms);
  });

  socket.on('leaveRoom', function(){
    socket.leave('Room-' + data.chatroom_no);//룸퇴장
    console.log('OUT ROOM LIST', chatRoomNSP.adapter.rooms);
  });

  socket.on('sendMsg', function(data){
    console.log('Room-' + data.chatroom_no);
    // chatRoomNSP.in('Room-' + data.chat_no).emit('receiveMsg', data.message);
    // app.io.sockets.in('Room-' + data.roomId).emit('receive message', data.message);//자신포함 전체 룸안의 유저
    socket.broadcast.to('Room-' + data.chatroom_no).emit('receiveMsg', data.message); //자신 제외 룸안의 유저
    //socket.in(room_id).emit('msgAlert',data); //broadcast 동일하게 가능 자신 제외 룸안의 유저
    //io.of('namespace').in(room_id).emit('msgAlert', data) //of 지정된 name space의 유저의 룸
  });

  socket.on('disconnect', function(){
    console.log('NOT USER DISCONNECT : ', socket.id);
    console.log('ROOM LIST', chatRoomNSP.adapter.rooms);
  });

  /*
  * 룸리스트 콘솔로그
  * socket.io 1.x 에서 io.sockets.manager.rooms => io.sockets.adapter.rooms
  * ROOM LIST { qNADgg3CCxESDLm5AAAA: [ qNADgg3CCxESDLm5AAAA: true ],
  test_room:
  [ qNADgg3CCxESDLm5AAAA: true,
  '0rCX3v4pufWvQ6uwAAAB': true,
  'iH0wJHGh-qKPRd2RAAAC': true ],
  '0rCX3v4pufWvQ6uwAAAB': [ '0rCX3v4pufWvQ6uwAAAB': true ],
  'iH0wJHGh-qKPRd2RAAAC': [ 'iH0wJHGh-qKPRd2RAAAC': true ] }
  */

});

module.exports = app;
