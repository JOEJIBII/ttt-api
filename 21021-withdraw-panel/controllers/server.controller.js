const model = require('../models/server.model');
const functions = require('../functions/server.function');
const { json } = require('express');
const moment = require('moment');
const { Double } = require('mongodb');
module.exports.withdraw = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    const payload = JSON.parse(req.headers.payload)
    console.log(payload)
    const { body } = req
    console.log(body)

    try {
        let checktrasaction = await model.checktrasaction(body.agent_id, body.user_id).catch(() => { throw err });
        console.log("checktrasaction")
        if (checktrasaction.length === 0) {
            if (body.agent_id !== null && body.agent_id !== '') {
                let withdraw_configs = await model.getwithdraw_config(body.agent_id).catch(() => { throw err });
                console.log(withdraw_configs)
                let getbankweb = await model.getbankweb(body).catch(() => { throw err });
                console.log("getbankweb", getbankweb)
                let member = await model.findbankmemb(body.user_id).catch(() => { throw err });
                console.log("member", member)
                let profile = await functions.ProfilePD(member[0].mem_pd.memb_username, withdraw_configs[0]).catch(() => { throw err });
                console.log("profile", profile)
                let credit_balance = profile.result.result.data.balance
                console.log("credit_balance", credit_balance)
                let withdraw = body.balance
                console.log("withdraw", withdraw)
                if (withdraw <= credit_balance) {
                    let counter_config = withdraw_configs[0].counter
                    let Counter = await model.counttrasaction(body.agent_id, body.user_id).catch(() => { throw err });
                    console.log("counter", Counter.length)
                    let note = [{ username: "System", note: "จำนวนการถอนของวันนี้ " + Counter.length, note_date: new Date(moment().format()) }]
                    //console.log("Counter_config", Counter.length)
                    if (Counter.length <= counter_config) {
                        let min_config = withdraw_configs[0].min
                        let max_config = withdraw_configs[0].max
                        if (withdraw >= min_config) {
                            if (withdraw <= max_config) {
                                let getlastdeposit = await model.getlastdeposit(body.agent_id, body.user_id).catch(() => { throw err });
                                let turn = Double()
                                console.log("getlastdeposit", getlastdeposit)
                                if (getlastdeposit.length !== 0) {
                                    if (getlastdeposit[0].ref_id !== null) {
                                        let checkturnover = await functions.checkturnover(member[0].mem_pd.memb_username, withdraw_configs[0], getlastdeposit[0].ref_id).catch(() => { throw err });
                                        const { hdp, mixParlay, mixStep, casino, slot, card, lotto, keno, trade, poker, } = checkturnover.result.result.data
                                        turn = Double(hdp.turn) + Double(mixParlay.turn) + Double(mixStep.turn) + Double(casino.turn) + Double(slot.turn) + Double(card.turn) + Double(lotto.turn) + Double(keno.turn) + Double(trade.turn) + Double(poker.turn)
                                        note = note.concat([{ username: "System", note: "turnover " + turn, note_date: new Date(moment().format()) }])
                                        const winlose = Double(hdp.wl) + Double(mixParlay.wl) + Double(mixStep.wl) + Double(casino.wl) + Double(slot.wl) + Double(card.wl) + Double(lotto.wl) + Double(keno.wl) + Double(trade.wl) + Double(poker.wl)
                                        note = note.concat([{ username: "System", note: "winlose " + winlose, note_date: new Date(moment().format()) }])
                                    } //                     //console.log(checkturnover.result.result.data)
                                }
                                let suspendstatus = await functions.changestatus(member[0].mem_pd.memb_username, withdraw_configs[0]).catch(() => { throw err });
                                if (suspendstatus.result.status === "200") {
                                     let OpenPO = await model.InsertDocWithdraw(payload, withdraw, member[0], getbankweb[0], note, turn,body).catch(() => { throw err });
                                     if (OpenPO.insertedId !== null && OpenPO.insertedId !== '') {
                                         res.send({ status: "200", message: 'กรุณารอซักครู่ระบบกำลังตรวจสอบ TrunOver', withdraw_count: Counter.length }).end();
                                     } else {
                                        res.send({ status: "201", message: 'ไม่สามารถสร้างใบถอนได้สำเร็จ' }).end();
                                     }
                                } else {
                                    res.send({ status: "202", message: 'ไม่สามารถสร้างใบถอนได้สำเร็จ กรุณาลองใหม่' }).end();
                                }

                            } else {
                                res.send({ status: "202", message: 'กรุณาถอนน้อยกว่า ' + max_config + " บาท" }).end();
                            }
                        } else {
                            res.send({ status: "202", message: 'กรุณาถอนมากกว่า ' + min_config + ' บาท' }).end();
                        }
                    } else {
                        res.send({ status: "202", message: 'ถอนเกินจำนวนครั้งต่อวัน ' + 'จำนวนที่ถอนของวันนี้  ' + Counter + 'ครั้ง' }).end();
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
