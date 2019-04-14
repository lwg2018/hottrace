var express = require('express');
var router = express.Router();
var ps = require('python-shell');

/* Get Login page */
router.get('/', function(req, res, next) {
    var options = {
        mode: 'text',
        pythonPath: process.env.PYTHON_PATH, // 모듈이 다 설치되어있는 파이썬 경로를 지정해야함
        pythonOptions: ['-u'],
        args: [req.param('city'), req.param('people'), req.param('age'), req.param('money'), req.param('time')]
    };
    
    ps.PythonShell.run(process.env.PYTHON_MACHINE_PATH, options, function(err, results){
       if(err) throw err;
        
        console.log(req.param('city'), req.param('people'), req.param('age'), req.param('money'), req.param('time'));
        console.log('result: %j', results);
    });
});

module.exports = router
