const { CronJob } = require("cron");
const { round } = require("lodash");
const ObjectDriver = new Map();
const _ = require("lodash");
const moment = require('moment');

const fx = require("../functions/server.function");
const model = require("../models/server.model");


var working = false;

module.exports = async () => {
    new CronJob("*/10 * * * * *", async () => {
        try {
            console.log("start")
            //working = false
             if (working !== false) {
                console.log("working")
                working = false
                let findtransaction = await model.findalltransaction().catch(() => { throw err });
                console.log("findtransaction",findtransaction.length)
                if (findtransaction.length > 0) {
                    for (var i = 0; i < findtransaction.length; i++) {
                        console.log("ROUND", [i])
                        let updatefile = await model.updatefiletransaction(findtransaction[i]._id, "processing").catch(() => { throw err });
                        await mainProcess(findtransaction[i]);
                    }
                    working = true;
                } else {
                    working = true;
                }
            }else{
                working = true;
            }
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
                    //let updatefile = await model.updatefiletransaction(data._id, "processing").catch(() => { throw err });
                    console.log("round"[i])
                    let getmemb_id = await model.findmemberId(trasaction[i].username, data.agent_id).catch(() => { throw err });
                     console.log("getmemb_id",getmemb_id[0])
                    if (getmemb_id.length > 0) {
                        let getmemb_bank = await model.getbankmember(getmemb_id[0].memb_id, data.agent_id).catch(() => { throw err });
                        //console.log("getmemb_bank",getmemb_bank[0])
                        if (getmemb_bank.length > 0) {

                            let call = await fx.depositPD(cof[0], trasaction[i].username, trasaction[i].amount).catch(() => { throw err });
                            //console.log(call)
                            if (call.result.msg === "SUCCESS") {
                                await model.updatetransaction(data._id, trasaction[i].no, "success", note,getmemb_id[0].memb_id).catch(() => { throw err });
                                note = note.concat([{ username: "system", note: "คืนยอดเสีย", note_date: new Date(moment().format()) }])
                                await model.InsertDocdeposit(trasaction[i], data.cr_by, getmemb_bank[0], getbankagent[0], data.agent_id, getmemb_id[0].memb_id,note,call.result.refId).catch(() => { throw err });

                            } else {
                                //not success provider
                                await model.updatetransaction(data._id, trasaction[i].no, call.result.msg,getmemb_id[0].memb_id).catch(() => { throw err });
                            }
                        } else {
                            //not found bankmember
                            note = note.concat([{ username: "system", note: "ไม่พบ bank member", note_date: new Date(moment().format()) }])
                            await model.updatetransaction(data._id, trasaction[i].no, "failed", note,getmemb_id[0].memb_id).catch(() => { throw err });
                        }
                    } else {
                        //not found member
                        note = note.concat([{ username: "system", note: "ไม่พบ member", note_date: new Date(moment().format()) }])
                        await model.updatetransaction(data._id, trasaction[i].no, "failed", note).catch(() => { throw err });
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

