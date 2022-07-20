const model = require('../models/server.model');
const functions = require('../functions/server.function')
//const { urlencoded } = require("express");
//const _ = require("lodash");
module.exports.getallmember = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    console.log(JSON.parse(req.headers.payload))
    try {
        console.log("-----",req.body?.page)
        if(req.body?.page !== undefined && req.body?.range !== undefined){
            let ResultMEMBER = await model.getallmember(req.body).catch(() => { throw err });
            let page_option = (await model.page_option(req.body).catch(() => { throw err }))[0];
            if (ResultMEMBER && ResultMEMBER.length) {
                // console.log('Result',ResultMEMBER)
                const log = await functions.logs(req.body, req.headers.host).catch(() => { throw err });
                res.send({
                    status: "200",
                    message: "success",
                    result: {
                        total: ResultMEMBER.length,
                        page_option,
                        Member: ResultMEMBER,
    
                    }
                }).end();
            } else {
                res.send({ status: "201", message: 'not found data' }).end();
            }
        }else{
            let ResultMEMBER = await model.getallmemb(req.body).catch(() => { throw err });
           // console.log(ResultMEMBER)
            if (ResultMEMBER && ResultMEMBER.length) {
                // console.log('Result',ResultMEMBER)
                const log = await functions.logs(req.body, req.headers.host).catch(() => { throw err });
                res.send({
                    status: "200",
                    message: "success",
                    result: {
                        total: ResultMEMBER.length,
                      //  page_option,
                        Member: ResultMEMBER,
    
                    }
                }).end();
            } else {
                res.send({ status: "201", message: 'not found data' }).end();
            }
        }
        //let ResultMEMBER = await model.getallmember(req.body).catch(() => { throw err });
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