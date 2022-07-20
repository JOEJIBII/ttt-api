const model = require('../models/server.model');
const functions = require('../functions/server.function')
//const { urlencoded } = require("express");
//const _ = require("lodash");
module.exports.getallemployee = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    const payload = JSON.parse(req.headers.payload)
    //console.log(payload)
    const body = req.body
    try {
        let pool = await model.getagent_id(payload.user_id).catch(() => { throw err });
        let ResultMEMBER =null
        let T = []
       // console.log(pool)
        var agent_id = pool[0].agent_id
        for (var i=0; i < agent_id.length; i++) {
           // console.log(agent_id[i])
           // Result = await model.getprefix(agent_id[i]).catch(() => { throw err });
           ResultMEMBER = await model.getallemp(agent_id[i],body).catch(() => { throw err });
            //console.log(ResultMEMBER)
            T = T.concat(ResultMEMBER)
         }
         ResultMEMBER = T

         //let transaction = [...deposit, ...withdraw]
         //ResultMEMBER = ResultMEMBER.sort((a, b) => b.crate_date - a.crate_date);
         
         let skip = (Number(body.page) - 1) * Number(body.range);
         let range = Number(body.range);
       // let ResultMEMBER = await model.getallemp().catch(() => { throw err });
         console.log(ResultMEMBER.slice(skip, (skip + range)))
        if (ResultMEMBER.slice(skip, (skip + range)).length !== 0) {
            let responses = await functions.Mappingdata(ResultMEMBER,payload.user_id).catch(() => {throw err});
            const log = await functions.logs(req.body, req.headers.host).catch(() => { throw err });
                res.send({
                    status: "200",
                    message: "success",
                    result: {
                        total: responses.emp.length,
                        page_option: {
                            total_match: responses.emp.length,
                            now_page: Number(body.page),
                            total_match_page: Math.ceil(responses.emp.length / range),
                            start_rec: (skip + 1),
                            end_rec: (((skip + range) >= responses.emp.length) ? responses.emp.length : (skip + range))
                        },
                       emp:responses.emp
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