const model = require('../models/server.model');
const functions = require('../functions/server.function');
const { json } = require('express');
const moment = require('moment');

//const { urlencoded } = require("express");

//const _ = require("lodash");
module.exports.withdraw = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    const payload = JSON.parse(req.headers.payload)
    console.log(payload)
    //console.log(JSON.parse(req.headers.payload))Mappingdata

    try {
       // console.log(moment().format('YYYY-MM-DD'))
        let checktrasaction = await model.checktrasaction(payload.agent_id,payload.user_id).catch(() => { throw err });
        //let counttrasactionamount = await model.counttrasactionamount(payload.agent_id,payload.user_id).catch(() => { throw err });
        //console.log(counttrasactionamount.length)
        if (checktrasaction.length === 0) {
            if (payload.agent_id !== null && payload.agent_id !== '') {
                let withdraw_configs = await model.getwithdraw_config(req.body, JSON.parse(req.headers.payload)).catch(() => { throw err });
                let getbankweb = await model.getbankweb(req.body, JSON.parse(req.headers.payload)).catch(() => { throw err });
               // console.log("bankweb", getbankweb)

                console.log("user_id", payload.user_id)
                let member = await model.findbankmemb(payload.user_id).catch(() => { throw err });
                // console.log("bank",bankwitdrawfrom)
                //console.log("mem", member[0])
                let profile = await functions.ProfilePD(payload.username, withdraw_configs[0]).catch(() => { throw err });
                //console.log("profile", profile)
                let credit_balance = profile.result.result.data.balance
                let withdraw = req.body.balance
                if (withdraw <= credit_balance) {
                    //let getCounter = await model.Withrawcount(payload.user_id, 1.0).catch(() => { throw err });
                    //console.log("Conter",getCounter)
                    let counter_config = withdraw_configs[0].counter
                    let Counter = await model.counttrasaction(payload.agent_id,payload.user_id).catch(() => { throw err });
                    
                    console.log("Counter_config",Counter.length)
                    if (Counter.length <= counter_config) {
                        let min_config = withdraw_configs[0].min
                        let max_config = withdraw_configs[0].max
                        if (withdraw >= min_config) {
                            if (withdraw <= max_config) {
                                let OpenPO = await model.InsertDocWithdraw(payload, withdraw, member[0], getbankweb[0]).catch(() => { throw err });
                                if (OpenPO.insertedId !== null && OpenPO.insertedId !== '') {
                                    res.send({ status: "200", message: 'กรุณารอซักครู่ระบบกำลังตรวจสอบ TrunOver', withdraw_count: Counter.length }).end();
                                } else {
                                    res.send({ status: "201", message: 'ไม่สามารถสร้างใบถอนได้สำเร็จ' }).end();
                                    //let getCounter = await model.Withrawcount(payload.user_id, -1.0).catch(() => { throw err });
                                }
                            } else {
                                res.send({ status: "202", message: 'กรุณาถอนน้อยกว่า ' + max_config + " บาท" }).end();
                               // let getCounter = await model.Withrawcount(payload.user_id, -1.0).catch(() => { throw err });
                            }

                        } else {
                            res.send({ status: "202", message: 'กรุณาถอนมากกว่า ' + min_config + ' บาท' }).end();
                           // let getCounter = await model.Withrawcount(payload.user_id, -1.0).catch(() => { throw err });
                        }

                    } else {
                        res.send({ status: "202", message: 'ถอนเกินจำนวนครั้งต่อวัน ' + 'จำนวนที่ถอนของวันนี้  ' + Counter + 'ครั้ง' }).end();
                       // let getCounter = await model.Withrawcount(payload.user_id, -1.0).catch(() => { throw err });
                    }

                } else
                    res.send({ status: "202", message: 'credit ไม่พอสำหรับการถอน' }).end();

            } else {
                res.send({ status: "203", message: 'invalid parameter' }).end();
            }
        } else {
            res.send({ status: "204", message: 'พบมีรายการถอนอยู่แล้ว กรุณารอ' }).end();
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