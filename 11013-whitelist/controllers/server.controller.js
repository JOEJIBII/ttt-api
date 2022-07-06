const model = require('../models/server.model');
const functions = require('../functions/server.function');
const { ObjectId, ObjectID } = require('mongodb');
//const { urlencoded } = require("express");

//const _ = require("lodash");
module.exports.checkagent = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    const header = req.headers["x-real-ip"]
    console.log("----------------------------------------------------------------------------")
    console.log("header---------------",header)
    console.log("----------------------------------------------------------------------------")
    console.log("req---------------",req.origin)
    console.log("----------------------------------------------------------------------------")
    try {
            
        let Result = await model.checkagentid(req.body).catch(() => { throw err });
        console.log(Result[0]._id)
        if (Result && Result.length) {
            const log = await functions.logs(req.body,req.headers.host).catch(() => {throw err});
            res.send({
                status: "200",
                message: "success",
                result: {
                        agent_id:ObjectId(Result[0]._id),
                }
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