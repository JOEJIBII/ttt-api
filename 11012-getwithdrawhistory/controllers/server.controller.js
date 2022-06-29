const model = require('../models/server.model');
const functions = require('../functions/server.function');

//const { urlencoded } = require("express");

//const _ = require("lodash");
module.exports.getwithdrawhistory = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    req.headers["x-real-ip"]
    const payload = JSON.parse(req.headers.payload)
    //console.log(payload)
    try {
            
        let Result = await model.getwithdrawhistory(payload).catch(() => { throw err });
        console.log(Result)
        Result = Result.sort(function(a, b){return new Date(b.request_date) - new Date(a.request_date)})
        if (Result && Result.length) {
            const log = await functions.logs(req.body,req.headers.host).catch(() => {throw err});
            res.send({
                status: "200",
                message: "success",
                total_history:Result.length,
                history_withdraw:Result
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