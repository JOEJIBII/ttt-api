const model = require('../models/server.model');
const functions = require('../functions/server.function');

//const { urlencoded } = require("express");

//const _ = require("lodash");
module.exports.getprefix = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    req.headers["x-real-ip"]
    const payload = JSON.parse(req.headers.payload)
    try {
        let pool = await model.getagent_id(payload.user_id).catch(() => { throw err });
        let Result =null
        let T = []
        console.log(pool)
        var agent_id = pool[0].agent_id
        for (var i=0; i < agent_id.length; i++) {
            console.log(agent_id[i])
            let j = i -1
            Result = await model.getprefix(agent_id[i]).catch(() => { throw err });
            console.log(Result)
            T = T.concat(Result)
         }
         Result = T
        //let Result = await model.getprefix(pool[0].agent_id[0]).catch(() => { throw err });
       // console.log(Result)
        if (Result && Result.length) {
            const log = await functions.logs(req.body,req.headers.host).catch(() => {throw err});
            res.send({
                status: "200",
                message: "success",
                total:Result.length,
                result_perfix:Result
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