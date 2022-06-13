const model = require('../models/server.model');
const functions = require('../functions/server.function')
const { urlencoded } = require("express");
//const _ = require("lodash");
module.exports.getwithdrawamount = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    //console.log(JSON.parse(req.headers.payload))
    const payload = JSON.parse(req.headers.payload)
    try {

        let getwithdrawamount = await model.getwithdraw(payload.agent_id).catch(() => { throw err });
         console.log(getwithdrawamount)
        //  let responses = await functions.Mappingdata(bankdeposit[0].bank_account_deposit).catch(() => {throw err});
        
        if (getwithdrawamount && getwithdrawamount.length) {
            // console.log('Result',ResultMEMBER)
            // const log = await functions.logs(req.body, req.headers.host).catch(() => { throw err });
            res.send({
                status: "200",
                message: "success",
                //result:responses.bank_account
                result:getwithdrawamount[0]
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