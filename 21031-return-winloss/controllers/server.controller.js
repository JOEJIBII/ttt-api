const model = require('../models/server.model');
const functions = require('../functions/server.function');
module.exports.returnwinloss = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    req.headers["x-real-ip"]
    const body = req.body
    const payload = JSON.parse(req.headers.payload)
    try {
        let ins = await model.insertwinloss(body, payload).catch(() => { throw err });
        if (ins.insertedId !== null && ins.insertedId !== "") {
          //  {
//     let cof = await model.getconfig_pd(body.agent_id).catch(() => { throw err });
        //     //console.log("cof",cof[0])
        //     let findtransaction = await model.findtransaction(ins.insertedId, body).catch(() => { throw err });
        //     //console.log("getmemb_id",getmemb_id[0])
        //     let getbankagent = await model.getbankagent(body.agent_id).catch(() => { throw err });
        //    // console.log("getbankagent",getbankagent[0])
        //     var trasaction = findtransaction[0].trasaction_file
        //     for (var i = 0; i < trasaction.length; i++) {
        //        // console.log(trasaction[i])

        //         let getmemb_id = await model.findmemberId(trasaction[i].username, body.agent_id).catch(() => { throw err });
        //         // console.log("getmemb_id",getmemb_id[0])
        //         if (getmemb_id.length > 0) {
        //             let getmemb_bank = await model.getbankmember(getmemb_id[0].memb_id, body.agent_id).catch(() => { throw err });
        //              //console.log("getmemb_bank",getmemb_bank[0])
        //             if (getmemb_bank.length > 0) {
        //                 //console.log("getmemb_bank",getmemb_bank[0])
        //                  let call = await functions.depositPD(cof[0], trasaction[i].username, trasaction[i].amount).catch(() => { throw err });
        //                console.log(call)
        //                 if (call.result.msg === "SUCCESS") { 
        //                   await model.updatetransaction(ins.insertedId, trasaction[i].no,"success",null).catch(() => { throw err });
        //                  // body,payload,bankform,bankto,agent_id,memb_id
        //                   await model.InsertDocdeposit(trasaction[i],payload,getmemb_bank[0],getbankagent[0],body.agent_id,getmemb_id[0].memb_id).catch(() => { throw err });

        //                 }else{
        //                     //not success provider
        //                    await model.updatetransaction(ins.insertedId, trasaction[i].no,call.result.msg ,).catch(() => { throw err });
        //                 }
        //             } else {
        //                  //not found bankmember
        //                  await model.updatetransaction(ins.insertedId, trasaction[i].no,"fail","ไม่พบ bank member").catch(() => { throw err });
        //             }
        //         } else {
        //             //not found member
        //             await model.updatetransaction(ins.insertedId, trasaction[i].no,"fail","ไม่พบ member").catch(() => { throw err });
        //         }
        //     }
          //  }
        
            // let updatefile = await model.updatefiletransaction(ins.insertedId,"success").catch(() => { throw err });
            // if(updatefile.modifiedCount > 0){
            //    
            // }
            res.send({ status: "200", message: 'success' }).end();
        } else {
            // insert ไม่สำเร็จ
        }
    } catch (error) {
        res.send({ status: "300", message: 'internal error' }).end();
    }
}
