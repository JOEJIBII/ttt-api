const model = require('../models/server.model');
const functions = require('../functions/server.function')
//const { urlencoded } = require("express");
//const _ = require("lodash");
module.exports.getallemployee = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    const payload = JSON.parse(req.headers.payload)
    //console.log(payload)
    try {

        let ResultMEMBER = await model.getallemp().catch(() => { throw err });
         console.log(ResultMEMBER)
        if (ResultMEMBER && ResultMEMBER.length) {
            // console.log('Result',ResultMEMBER)
            let responses = await functions.Mappingdata(ResultMEMBER,payload.user_id).catch(() => {throw err});
            const log = await functions.logs(req.body, req.headers.host).catch(() => { throw err });
            
            res.send({
                status: "200",
                message: "success",
                result: {
                    total: responses.emp.length,
                    ResultMEMBER
                   // emp:responses.emp
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