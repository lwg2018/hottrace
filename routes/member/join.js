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

router.get('/', function (req, res, next) {
    res.redirect('/');
});

router.post('/', function (req, res, next) {
    //빈칸있는지 검사, db에 중복값 검사
    //다 올바른경우 db에 저장.
    //res.render('login/loginForm');
    member_email = req.body.email;
    member_name = req.body.name;
    member_pwd = req.body.password;
    member_age = req.body.age;

    var strSQL = "select * from " + process.env.DB_TALK_NAME + ".dbo.htMember where email='" + member_email + "'";
    console.log(strSQL);
    MsSql.connect(sqlConfig, function (err) {
        var request = new MsSql.Request();

        request.query(strSQL, (err, row) => {
            var memberInfo = row.recordset[0];
            var count = 0;
            if (row.rowsAffected == 0) {
                var sess = req.session;
                //INSERT INTO 테이블명 (COLUMN_LIST) VALUES (COLUMN_LIST에 넣을 VALUE_LIST);
                var strSQL5 = "select * from " + process.env.DB_TALK_NAME + ".dbo.htMember";
                request = new MsSql.Request();
                request.query(strSQL5, (err, row5) => {
                    var strSQL2 = "select MAX(member_no) from hottrace.dbo.htMember";
                    console.log(strSQL2);
                    request = new MsSql.Request();
                    request.query(strSQL2, (err, row2) => {
                        var no = row2.recordset[0][''] + 1;
                        var strSQL3 = "insert into hottrace.dbo.htMember (email, password, phone, country, name, age, member_no) values('" + member_email + "', '" + member_pwd + "', '01000000000', '대한민국', '" + member_name + "', " + member_age + ", " + no + ")";
                        console.log("row5 len " + row5.recordset.length);
                        for (var i = 0; i < row5.recordset.length; i++) {
                            var strSQL4 = "insert into hottrace.dbo.htFriend(member_no, friend_no) values(" + no + ", " + row5.recordset[i]['member_no'] + ")";
                            console.log("friend " + strSQL4);
                            request = new MsSql.Request();
                            request.query(strSQL4, (err, row4) => {
                                count++;
                            });
                        }
                        console.log(strSQL3);
                        request = new MsSql.Request();
                        request.query(strSQL3, (err, row3) => {
                            while(count != row5.recordset.length);
                            res.render('logIn/loginForm', {
                                join: true
                            });
                            MsSql.close();
                        });
                    });
                });
                //res.render('main', {result: true});
                // res.render('index', {member_no : sess.member_no});
            } else {
                res.render('logIn/loginForm', {
                    join: false
                });
                MsSql.close();
            }
        });
    });
});

module.exports = router;
