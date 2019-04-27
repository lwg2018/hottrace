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

router.post('/write_review', function(req, res, next){
    //res.render('member/profile');
    var strSQL = "select MAX(board_id) from " + process.env.DB_TALK_NAME + ".dbo.htBoard";
    MsSql.connect(sqlConfig, function(err) {
    var request = new MsSql.Request();
    request.query(strSQL, (err, row) => {
        var strSQL2 = "insert into hottrace.dbo.htBoard(board_id, board_title, board_content, board_comment, board_like, board_bad, board_file, board_kind, board_age, board_money, board_time, board_people, board_donut, board_pie) values(";
        var data = String(row.recordset[0]+1) + "," + String(req.board_title) + "," + String(req.board_content) + ",NULL,0,0,0," +  String(req.board_file) + ",review," + String(req.board_age) + "," + String(req.board_money) + "," + String(req.board_time) + "," + String(req.board_people) + "," + String(req.board_donut) + "," + String(req.board_pie) + ")";
        
    });

});

module.exports = router;