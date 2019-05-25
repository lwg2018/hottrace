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
    if (req.session.logined == true) {
        // 도넛 파이가 없으면 다른 곳으로 redirect
        // 세션으로 받아오기
        console.log(req.query.review_donut);
        if (!(req.query.review_donut) || !(req.query.review_pie)) {
            res.redirect('/main/' + req.session.city);
            return;
        }

        req.session.review_donut = req.query.review_donut;
        req.session.review_pie = req.query.review_pie;
        var strSQL = "select * from hottrace.dbo.htBoard where city='" + req.session.city + "' and board_donut=" + req.query.review_donut + " and board_pie=" + req.query.review_pie + " order by board_id desc";
        //console.log(req.query.ssss);
        MsSql.connect(sqlConfig, function (err) {
            var request = new MsSql.Request();
            request.query(strSQL, (err, row) => {
                if (err) {
                    console.log(err);
                }
                //console.log(row.recordset[0]);
                if(row.rowsAffected != 0){
                    console.log("sagasgahsrhshffh///////////////" + row.recordset.length);
                    res.render('board/list', {review_list: row.recordset, review_len: row.recordset.length});
                }else{
                    res.render('board/list', {review_len: 0});
                }
                MsSql.close();
            });
        });
    } else {
        res.redirect('/');
    }
});

router.get('/writeform', function (req, res, next) {
    if (!(req.session.review_donut) || !(req.session.review_pie)) {
        res.redirect('/main/' + req.session.city);
        return;
    }
    if (req.session.logined == true) {
        res.render('write', {
            review_donut: req.session.review_donut,
            review_pie: req.session.review_pie,
            review_city: req.session.review_city
        });
    } else {
        res.redirect('/');
    }
});

router.post('/write_review', function (req, res, next) {
    //res.render('member/profile');
    var strSQL = "select MAX(board_id) from " + process.env.DB_TALK_NAME + ".dbo.htBoard where city='" + req.session.city + "'";
    MsSql.connect(sqlConfig, function (err) {
        var request = new MsSql.Request();
        request.query(strSQL, (err, row) => {
            var strSQL2 = "insert into hottrace.dbo.htBoard(board_id, board_title, board_content, board_comment, board_like, board_bad, board_file, board_kind, board_age, board_money, board_time, board_people, board_donut, board_pie, city, board_writer) values(";
            var rowid = row.recordset[0][''] + 1;
            console.log(strSQL);
            console.log(row.recordset[0]['']);

            var data = String(rowid) + ",'" + String(req.body.board_title) + "','" + String(req.body.board_content) + "',NULL,0,0,NULL,'review'," + String(req.session.userage) + "," + String(req.body.board_money) + "," + String(req.body.board_time) + "," + String(req.body.board_people) + "," + String(req.body.review_donut) + "," + String(req.body.review_pie) + ",'" + String(req.session.city) + "','" + String(req.session.username) + "')";
            console.log(strSQL2 + data);
            var request2 = new MsSql.Request();
            request2.query(strSQL2 + data, (err, row) => {
                res.redirect('/board?review_donut=' + req.body.review_donut + "&review_pie=" + req.body.review_pie);
                MsSql.close();
            });
        });
    });
});

module.exports = router
