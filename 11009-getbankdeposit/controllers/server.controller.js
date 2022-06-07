const model = require('../models/server.model');
const functions = require('../functions/server.function')
const { urlencoded } = require("express");
//const _ = require("lodash");
module.exports.getbankdeposit = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    //console.log(JSON.parse(req.headers.payload))
    const payload = JSON.parse(req.headers.payload)
    try {

        let bankdeposit = await model.bankdeposit(payload.agent_id).catch(() => { throw err });
         //let responses = await functions.Mappingdata(bankdeposit.bank_account_deposit).catch(() => {throw err});
         let result = bankdeposit[0].bank_account_deposit
        //  console.log(bankdeposit[0].bank_account_deposit)
        if (bankdeposit && bankdeposit.length) {
            // console.log('Result',ResultMEMBER)
            // const log = await functions.logs(req.body, req.headers.host).catch(() => { throw err });
            res.send({
                status: "200",
                message: "success",
                result
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