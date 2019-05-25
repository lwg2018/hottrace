var express = require('express');
var router = express.Router();
var ps = require('python-shell');
var MsSql = require('mssql');

var sqlConfig = {
    user: process.env.DB_TALK_USER,                                                                              
    password: process.env.DB_TALK_PASSWORD,
    server: process.env.DB_HOST,
    port: process.env.SERVER_PORT,
    database: process.env.DB_TALK_NAME
};

/* Get Login page */
router.post('/', function(req, res, next) {
    var options = {
        mode: 'text',
        pythonPath: process.env.PYTHON_PATH, // 모듈이 다 설치되어있는 파이썬 경로를 지정해야함
        pythonOptions: ['-i'],
        args: [req.session.city, req.body.people, req.body.age, req.body.money, req.body.time]
    };
    
    ps.PythonShell.run(process.env.PYTHON_MACHINE_PATH, options, function(err, results){
       if(err) throw err;
        
        console.log(req.session.city, req.body.people, req.body.age, req.body.money, req.body.time);
        console.log('result: %j', results);

        var strSQL = "select * from hottrace.dbo.htCircle where city='" + req.session.city + "' and donut=" + results[1] + " and pie=" + results[2] + " and nationality='" + req.body.nationality + "' and day_or_night='" + req.body.d_or_n + "'";
        console.log(strSQL);
        //console.log(strSQL);
        MsSql.connect(sqlConfig, function(err) {
            var request = new MsSql.Request();
            request.query(strSQL, (err, row) => {
              if(err){
                  console.log(err);
              }
              //console.log(row.recordset[0]);
              res.send({result:true, values:results, circle_info: row.recordset[0]});
              MsSql.close();
            });
        });
    });
});

module.exports = router
