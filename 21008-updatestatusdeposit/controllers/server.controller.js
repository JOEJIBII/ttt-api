const model = require('../models/server.model');
const functions = require('../functions/server.function');

//const { urlencoded } = require("express");

//const _ = require("lodash");
module.exports.updatestatusdeposit = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    req.headers["x-real-ip"]
    const payload = JSON.parse(req.headers.payload)
    const body = req.body
    console.log(payload)
    try {
        
            if(body.status === "check"){
                    await model.updatechecked(body,payload).catch(() => { throw err });
                res.send({
                    status: "200",
                    message: "success",
                    result : getagentid
                }).end();
            }else{
                if(body.status === "approve"){
                    let getdocument = await model.getdocument(body.deposit_id).catch(() => { throw err });
                    let getconfig_pd = await model.getconfig_pd(getdocument[0].agent_id).catch(() => { throw err });
                    let getmembpd = await model.getmembpd(getdocument[0].memb_id).catch(() => { throw err });
                    //console.log(getconfig_pd[0])
                    //let getmemb = await model.getmemb(getdocument[0].memb_id).catch(() => { throw err });
                   // console.log(getmemb[0].financial.deposit_first_time)
                    let depositPD = await functions.depositPD(getconfig_pd[0],getmembpd[0].username,getdocument[0].amount).catch(() => { throw err });
                    console.log(depositPD)
                    if(depositPD.result.code === 0){
                       await model.updatecredit(getdocument[0].agent_id,depositPD.result.data.agent.afterCredit,payload).catch(() => { throw err });
                       await model.updaterefid(body.deposit_id,depositPD.result.refId,payload).catch(() => { throw err });
                        let getmemb = await model.getmemb(getdocument[0].memb_id).catch(() => { throw err });
                        if(getmemb[0].financial.deposit_first_time === null ){
                                await model.update_financial(getdocument[0].memb_id,getdocument[0].amount,payload).catch(() => { throw err });
                            res.send({
                                status: "200",
                                message: "success",
                            }).end(); 
                        }else{
                            await model.updateapprove(body,payload).catch(() => { throw err });
                            await model.update_financial(getdocument[0].memb_id,getdocument[0].amount,payload).catch(() => { throw err });
                            res.send({
                                status: "200",
                                message: "success",
                            }).end(); 
                        }
                    }
                }else{
                     if(body.status === "cancel"){
                        await model.updatereject(body,payload).catch(() => { throw err });
                        res.send({
                            status: "200",
                            message: "success",
                            result : getagentid.modifiedCount
                        }).end(); 
                    }
                }
            }
        
    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}

