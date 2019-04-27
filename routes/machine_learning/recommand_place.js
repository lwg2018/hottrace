var express = require('express');
var router = express.Router();
var ps = require('python-shell');

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
        res.send({result:true, values:results});
    });
});

module.exports = router
