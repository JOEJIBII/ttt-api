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
                let findjob = await model.findjob().catch(() => { throw err });
                console.log("findjob",findjob.length)
                if (findjob.length > 0) {
                    for (var i = 0; i < findjob.length; i++) {
                         console.log("ROUND", [i])
                        // let updatefile = await model.updatefiletransaction(findtransaction[i]._id, "processing").catch(() => { throw err });
                       await mainProcess(findjob[i]);
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
            console.log("data",data)
            let getconfig_pd = await model.getconfig_pd(data.agent_id).catch(() => { throw err });
            console.log("getconfig_pd",getconfig_pd)
            let finddeposit = await model.finddeposit(data.memb_id).catch(() => { throw err });
            console.log("finddeposit",finddeposit)
            if(finddeposit.length > 0){
                let finddeposit = await fx.checkturnover(data.username,getconfig_pd[0],finddeposit[0].ref_id).catch(() => { throw err });
                // คำนวน turnover เทียบค่า 
                // ลบ turnoverProfile
                // Turnover === 0 
                
            }

            //update doc withdraw
                // ถอน credit
                //
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
}

