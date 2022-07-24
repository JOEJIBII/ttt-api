const { CronJob } = require("cron");
const { round } = require("lodash");
const ObjectDriver = new Map();
const _ = require("lodash");
const moment = require('moment');
const { Double } = require("mongodb");

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
                console.log("findjob", findjob.length)
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
            } else {
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
            console.log("data", data)
            let getconfig_pd = await model.getconfig_pd(data.agent_id).catch(() => { throw err });
            console.log("getconfig_pd", getconfig_pd)





            let finddeposit = await model.finddeposit(data.memb_id).catch(() => { throw err });

            //let result = []
            // console.log("pool", pool)







            let turnover_profile = await model.findturnoverprofile(data.memb_id).catch(() => { throw err });
            console.log("finddeposit", finddeposit)
            if (finddeposit.length > 0) {
                finddeposit = finddeposit[0].deposit_id
                for (var i = 0; i < finddeposit.length; i++) {
                    console.log("finddeposit", finddeposit[i])
                    let turnover_pd = await fx.checkturnover(data.username, getconfig_pd[0], finddeposit[0].ref_id).catch(() => { throw err });
                    console.log("turnover_pd", turnover_pd)
                    console.log("turnover_pd", turnover_pd.result.result.data)
                    let turn = Double(0)
                    if (turnover_pd.result.result.code === 100033) {

                    } else {
                        const { hdp, mixParlay, mixStep, casino, slot, card, lotto, keno, trade, poker, } = turnover_pd.result.result.data
                        turn = Double(hdp.turn) + Double(mixParlay.turn) + Double(mixStep.turn) + Double(casino.turn) + Double(slot.turn) + Double(card.turn) + Double(lotto.turn) + Double(keno.turn) + Double(trade.turn) + Double(poker.turn)
                       
                    }
                    turnover_result = Duuble(finddeposit.turnover_value) - Double(turn)
                    result_turnover_profile = Double()
                    if (turnover_result > 0) {
                        result_turnover_profile = Double(turnover_profile.turnover) - Double(turn)
                    } else {
                        result_turnover_profile = Double(turnover_profile.turnover) - Double(finddeposit.turnover_value)
                    }

                    await model.update_turnover(data.memb_id, result_turnover_profile).catch(() => { throw err });
                    if (result_turnover_profile === 0 || result_turnover_profile < 0) {
                        await fx.withdraw(getconfig_pd[0], data.username, data.amount).catch(() => { throw err });
                    }
                    if([i]=== 0){
                        await model.update_docdeposit_status(finddeposit[i].deposit_id,turn).catch(() => { throw err });
                        //update_docdeposit_status
                    }else{
                        await model.update_docdeposit_turnover(finddeposit[i].deposit_id,turn,close).catch(() => { throw err });
                        //update_docdeposit_turnover
                    }
                }
            }

            //update doc withdraw
            // ถอน credit
            //
            resolve(true);
        } catch (err) {
            reject(error);
        }
    });
}

