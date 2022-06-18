const model = require('../models/server.model');
const functions = require('../functions/server.function');

//const { urlencoded } = require("express");

//const _ = require("lodash");
module.exports.getprivilege = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    req.headers["x-real-ip"]
    try {
            
        let Result = await model.getprivilege(req.body).catch(() => { throw err });
        //console.log(Result[0].length)
        if (Result && Result.length) {
            const log = await functions.logs(req.body,req.headers.host).catch(() => {throw err});
            res.send({
                status: "200",
                message: "success",
                total_privilege:Result[0].privilege.length,
                privilege:Result[0].privilege
            }).end();
        } else {
            res.send({ status: "201", message: 'not found data' }).end();
        }
                
                
          
    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}



//console.log(req.params.user)
  //  res.send({
    //    status: "200",
     //   param: req.params.user,
      //  message: "success",
    //}).end();