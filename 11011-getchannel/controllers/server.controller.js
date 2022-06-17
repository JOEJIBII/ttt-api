const model = require('../models/server.model');
const functions = require('../functions/server.function');

//const { urlencoded } = require("express");

//const _ = require("lodash");
module.exports.getchannel = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    req.headers["x-real-ip"]
    try {
            
        let Result = await model.getchannel(req.body).catch(() => { throw err });
        //console.log(Result)
        if (Result && Result.length) {
            const log = await functions.logs(req.body,req.headers.host).catch(() => {throw err});
            res.send({
                status: "200",
                message: "success",
                total_channel:Result.length,
                channel:Result
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