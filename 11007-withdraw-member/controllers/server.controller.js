const model = require('../models/server.model');
const functions = require('../functions/server.function');
const { json } = require('express');

//const { urlencoded } = require("express");

//const _ = require("lodash");
module.exports.withdraw = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    const payload = JSON.parse(req.headers.payload)
    console.log(payload)
    //console.log(JSON.parse(req.headers.payload))Mappingdata
   
    try {
            if (payload.agent_id !== null && payload.agent_id !== '') {
                let withdraw_configs = await model.getwithdraw_config( req.body,JSON.parse(req.headers.payload)).catch(() => { throw err });
                //console.log(withdraw_configs[0].bank_account)
                let bankwitdrawfrom = []
                let bankmember = []
                withdraw_configs[0].bank_account.forEach(e => {
                    if(e.bank_status === "Active"){
                        bankwitdrawfrom = e
                    }
                })
                console.log("user_id",payload.user_id)
                let member = await model.findbankmemb(payload.user_id).catch(() => { throw err });
                console.log("bank",bankwitdrawfrom)
                console.log("mem",member[0])
                member[0].banking_account.forEach(e => {
                        bankmember = e
                })
                console.log("Bmem",bankmember)
                let profile = await functions.ProfilePD(payload.username).catch(() => { throw err });
                let credit_balance = profile.result.result.data.balance
                let withdraw = req.body.balance 
                if(withdraw <= credit_balance ){
                    let getCounter = await model.Withrawcount(payload.user_id).catch(() => { throw err });
                    let counter_config = withdraw_configs[0].counter
                    let Counter = getCounter.value.financial.withdraw_count
                     //console.log("Conter",Counter)
                    //console.log("Counter_config",counter_config)
                    if(Counter <= counter_config){
                        let min_config = withdraw_configs[0].min
                        let max_config = withdraw_configs[0].max
                        if(withdraw >= min_config){
                            if(withdraw <= max_config){
                                let OpenPO = await model.InsertDocWithdraw(payload,withdraw,bankwitdrawfrom,member[0],bankmember).catch(() => { throw err });
                                if(OpenPO.insertedId !== null && OpenPO.insertedId !== ''){
                                    res.send({ status: "200", message: 'กรุณารอซักครู่ระบบกำลังตรวจสอบ TrunOver' }).end();
                                }else{
                                    res.send({ status: "201", message: 'ไม่สามารถสร้างใบถอนได้สำเร็จ' }).end();
                                }
                            }else{
                                res.send({ status: "202", message: 'กรุณาถอนมากกว่า '+ min_config }).end();
                            }
                            
                        }else{
                            res.send({ status: "202", message: 'กรุณาถอนมากกว่า '+ min_config + 'บาท'}).end();
                        }
                        
                    }else{
                        res.send({ status: "202", message: 'ถอนเกินจำนวนครั้งต่อวัน '+ 'จำนวนที่ถอนของวันนี้  ' + Counter + 'ครั้ง' }).end();
                    }
                   
                }else
                res.send({ status: "202", message: 'credit ไม่พอสำหรับการถอน' }).end();
                
            } else {
                res.send({ status: "203", message: 'invalid parameter' }).end();
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