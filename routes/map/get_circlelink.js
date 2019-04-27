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

//var clinkset = [];
//var count = 0;
//var wait = 0;

/* Get Login page */
router.post('/', function(req, res, next) {
//    clinkset = [];
//    count = 0;
//    wait = 0;
    var strSQL = "select * from " + process.env.DB_TALK_NAME + ".dbo.htCLink where city='" + req.session.city + "' and s_donut=" + req.body.donut + " and s_pie=" + req.body.pie + " order by weight desc";
    var clinkset = [];
    var count = 0;
    MsSql.connect(sqlConfig, function(err) {
    var request = new MsSql.Request();
    request.query(strSQL, (err, row) => {
      if(err){
          console.log(err);
      }
           
      for(var i=0; i<row.recordset.length; i++){
        //count = 0;
        if(row.recordset[i]['t_donut']==req.body.donut && row.recordset[i]['t_pie']==req.body.pie){
            clinkset[5] = row.recordset[i];
            //console.log('asgashashah');
            continue;
        }
        if(row.recordset[i]['distance'] <= req.body.distance){
            clinkset[count] = row.recordset[i];
            count++;
        }
        if(count >= 5)break;
      }

        var request2 = new MsSql.Request();   
        var strSQL2 =  "select c_lon, c_lat from " + process.env.DB_TALK_NAME + ".dbo.htCircle where city='" + req.session.city + "' and donut=" + req.body.donut + " and pie=" + req.body.pie;
        request2.query(strSQL2, (err2, row2) =>{
           if(err){
               console.log(err2);
           }
           clinkset[5]['lon'] = row2.recordset[0]['c_lon'];
           clinkset[5]['lat'] = row2.recordset[0]['c_lat'];
            //console.log(clinkset)
        });
      var wait = 0;
      for(var j=0; j<count; j++){
        var request2 = new MsSql.Request();   
        var strSQL2 =  "select c_lon, c_lat from " + process.env.DB_TALK_NAME + ".dbo.htCircle where city='" + req.session.city + "' and donut=" + clinkset[j]['t_donut'] + " and pie=" + clinkset[j]['t_pie'];
        request2.query(strSQL2, (err2, row2) =>{
           if(err){
               console.log(err2);
           }
           clinkset[wait]['lon'] = row2.recordset[0]['c_lon'];
           clinkset[wait]['lat'] = row2.recordset[0]['c_lat'];
            console.log(clinkset[j]);
            //tar_coodinate_x[i] = row2.recordset[0]['c_lon'];
            //tar_coodinate_y[i] = row2.recordset[0]['c_lat'];
            //tar_lon: tar_coodinate_x, tar_lat: tar_coodinate_y
            wait++;
            if(wait == count){
                console.log(clinkset);
                res.send({result:true, clinkset: clinkset, count: count});
                MsSql.close();
             }
        });
      }
//        console.log(row.recordset.length);
//        var request2 = new MsSql.Request();   
//        var strSQL2 =  "select c_lon, c_lat from " + process.env.DB_TALK_NAME + ".dbo.htCircle where city='" + req.session.city + "' and donut=" + clinkset[0]['t_donut'] + " and pie=" + clinkset[0]['t_pie'];
//        request2.query(strSQL2, (err2, row2) =>{
//           if(err){
//               console.log(err2);
//           }
//           clinkset[0]['lon'] = row2.recordset[0]['c_lon'];
//           clinkset[0]['lat'] = row2.recordset[0]['c_lat'];
//        });
//        var request2 = new MsSql.Request();   
//        var strSQL2 =  "select c_lon, c_lat from " + process.env.DB_TALK_NAME + ".dbo.htCircle where city='" + req.session.city + "' and donut=" + clinkset[1]['t_donut'] + " and pie=" + clinkset[1]['t_pie'];
//        request2.query(strSQL2, (err2, row2) =>{
//           if(err){
//               console.log(err2);
//           }
//           clinkset[1]['lon'] = row2.recordset[0]['c_lon'];
//           clinkset[1]['lat'] = row2.recordset[0]['c_lat'];
//        });  
//        var request2 = new MsSql.Request();   
//        var strSQL2 =  "select c_lon, c_lat from " + process.env.DB_TALK_NAME + ".dbo.htCircle where city='" + req.session.city + "' and donut=" + clinkset[2]['t_donut'] + " and pie=" + clinkset[2]['t_pie'];
//        request2.query(strSQL2, (err2, row2) =>{
//           if(err){
//               console.log(err2);
//           }
//           clinkset[2]['lon'] = row2.recordset[0]['c_lon'];
//           clinkset[2]['lat'] = row2.recordset[0]['c_lat'];
//        });  
//        var request2 = new MsSql.Request();   
//        var strSQL2 =  "select c_lon, c_lat from " + process.env.DB_TALK_NAME + ".dbo.htCircle where city='" + req.session.city + "' and donut=" + clinkset[3]['t_donut'] + " and pie=" + clinkset[3]['t_pie'];
//        request2.query(strSQL2, (err2, row2) =>{
//           if(err){
//               console.log(err2);
//           }
//           clinkset[3]['lon'] = row2.recordset[0]['c_lon'];
//           clinkset[3]['lat'] = row2.recordset[0]['c_lat'];
//        });  
//        var request2 = new MsSql.Request();   
//        var strSQL2 =  "select c_lon, c_lat from " + process.env.DB_TALK_NAME + ".dbo.htCircle where city='" + req.session.city + "' and donut=" + clinkset[4]['t_donut'] + " and pie=" + clinkset[4]['t_pie'];
//        request2.query(strSQL2, (err2, row2) =>{
//           if(err){
//               console.log(err2);
//           }
//           clinkset[4]['lon'] = row2.recordset[0]['c_lon'];
//           clinkset[4]['lat'] = row2.recordset[0]['c_lat'];
//        });
      });
    });
});


module.exports = router
