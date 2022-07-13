const { CronJob } = require("cron");
const { round } = require("lodash");
const ObjectDriver = new Map();
const _ = require("lodash");

const fx = require("../functions/server.function");
const model = require("../models/server.model");


var working = false;

module.exports = async () => {
    new CronJob("*/10 * * * * *", async () => {
        try {
            console.log("start")
            let findtransaction = await model.findalltransaction().catch(() => { throw err });
            // if (!working) {
                //console.log("working")
                //working === false && mainProcess();
               
                // console.log("findtransaction",findtransaction.length)
                if (findtransaction.length > 0) {
                    for (var i = 0; i < findtransaction.length; i++) {
                        console.log("ROUND", [i])
                        await mainProcess(findtransaction[i]);
                    }
                    working = true;
                } else {
                    working = true;
                }
            // }
        } catch (error) {
            console.error("main process error on ", new Date().toISOString());
            console.error(error);
            working = false;
        }
    }, null, true);
}

const mainProcess = data => {
    return new Promise(async (resolve, reject) => {
        try {
            let cof = await model.getconfig_pd(data.agent_id).catch(() => { throw err });
            //console.log("cof",cof[0])
            let getbankagent = await model.getbankagent(data.agent_id).catch(() => { throw err });
            // console.log("getbankagent",getbankagent[0])
            var trasaction = data.transaction_file
            if (data.transaction_file !== null) {
                for (var i = 0; i < trasaction.length; i++) {
                     let note = [{ username: data.cr_by_name, note: trasaction[i].description, note_date: new Date(data.cr_date) }]
                    let updatefile = await model.updatefiletransaction(data._id, "processing").catch(() => { throw err });
                    console.log("round"[i])
                    let getmemb_id = await model.findmemberId(trasaction[i].username, data.agent_id).catch(() => { throw err });
                    // console.log("getmemb_id",getmemb_id[0])
                    if (getmemb_id.length > 0) {
                        let getmemb_bank = await model.getbankmember(getmemb_id[0].memb_id, data.agent_id).catch(() => { throw err });
                        //console.log("getmemb_bank",getmemb_bank[0])
                        if (getmemb_bank.length > 0) {

                            let call = await fx.depositPD(cof[0], trasaction[i].username, trasaction[i].amount).catch(() => { throw err });
                            //console.log(call)
                            if (call.result.msg === "SUCCESS") {
                                await model.updatetransaction(data._id, trasaction[i].no, "success", null).catch(() => { throw err });
                                // body,payload,bankform,bankto,agent_id,memb_id
                                await model.InsertDocdeposit(trasaction[i], data.cr_by, getmemb_bank[0], getbankagent[0], data.agent_id, getmemb_id[0].memb_id,note,call.result.refId).catch(() => { throw err });

                            } else {
                                //not success provider
                                await model.updatetransaction(data._id, trasaction[i].no, call.result.msg,).catch(() => { throw err });
                            }
                        } else {
                            //not found bankmember
                            await model.updatetransaction(data._id, trasaction[i].no, "failed", "ไม่พบ bank member").catch(() => { throw err });
                        }
                    } else {
                        //not found member
                        await model.updatetransaction(data._id, trasaction[i].no, "failed", "ไม่พบ member").catch(() => { throw err });
                    }
                }
                let updatefile = await model.updatefiletransaction(data._id, "success").catch(() => { throw err });
                if (updatefile.modifiedCount > 0) {
                    // res.send({ status: "200", message: 'success' }).end();
                    working = true;
                    console.log("success")
                }
            } else {
                let updatefile = await model.updatefiletransaction(data._id, "failed").catch(() => { throw err });
            }

            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
}

