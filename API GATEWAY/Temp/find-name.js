var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://SA:mh4MJHcnXGtCq7bv@cluster0.wnaus.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
module.exports.find = () => {
  MongoClient.connect(url, function(err, db, name) {
    if (err) throw err;
     var dbo = db.db("Test1");
    var query = { username: name };
    dbo.collection("member").find(query).toArray(function(err, result) {
      if (err) throw err;
     console.log(result);
     
      db.close();
      return(result);
    });
  });
}