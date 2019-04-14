var express = require('express');
var router = express.Router();
var MsSql = require('mssql');

var sqlConfig = {
    user: process.env.DB_TALK_USER,                                                                              
    password: process.env.DB_TALK_PASSWORD,
    server: process.env.DB_HOST,
    port: process.env.SERVER_PORT,
    database: process.env.DB_TALK_NAME
};

router.post('/info_write', function(req, res, next){
    //res.render('member/profile');


});

router.post('/enquire_join', function(req, res, next){
        //빈칸있는지 검사, db에 중복값 검사
        //다 올바른경우 db에 저장.
        //res.render('login/loginForm');
});

module.exports = router;