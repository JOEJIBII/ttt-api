var express = require('express');
var app = express();
var fs = require("fs"); // อ่านไฟล์
var findname = require("./find-name");
//const { join } = require('path');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://SA:mh4MJHcnXGtCq7bv@cluster0.wnaus.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

  

//GET Method ดึงข้อมูลของ user มาทั้งหมด
//app.get('/getUsers', function (req, res) {
//fs.readFile(__dirname + "/" + "user.json",'utf8',function (err,data){
  //  console.log(data);
    //res.end( data );
    //});
//});

app.get('/getUsers', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
         var dbo = db.db("Test1");
        //var query = { "SELECT * FROM member" };
        dbo.collection("member").find({}).toArray(function(err, result) {
          if (err) throw err;
         console.log(result);
         res.json(result);
         //res.end(JSON.stringify(result));
          db.close();
        });
      });
    });

//GET Method BY Name
//app.get('/getUsers/:name', function (req, res) {
   // fs.readFile(__dirname + "/" + "user.json",'utf8',function (err,data){
  //      var users = JSON.parse(data);
   //     var user = users[req.params.name]
   //     console.log(user);
   //     res.end(JSON.stringify(user));
   //     });
  //  });

  app.get('/getUsers/:name', function (req, res) {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
             var dbo = db.db("Test1");
            var query = { username: req.params.name };
            dbo.collection("member").find(query).toArray(function(err, result) {
              if (err) throw err;
             console.log(result);
             res.json(result);
             //res.end(JSON.stringify(result));
              db.close();
            });
          });
    });
    app.use(express.json());
    app.post('/Register', function (req, res) {
        // console.log(req.body);
        // res.send(req.body)
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("Test1");
            var query = {  };
            dbo.collection("member").insertOne(req.body,function(err, result) {
             if (err) throw err;
             console.log(result);
             res.end(JSON.stringify(result));
              db.close();
           });
          });
    });

var server = app.listen(8081, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Application Run At http://%s:%s",host, port)
});
