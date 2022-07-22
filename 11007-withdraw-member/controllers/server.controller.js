const model = require('../models/server.model');
const functions = require('../functions/server.function');
const { json } = require('express');
const moment = require('moment');
const { Double } = require('mongodb');
module.exports.withdraw = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    const payload = JSON.parse(req.headers.payload)
    console.log(payload)

    try {
        let checktrasaction = await model.checktrasaction(payload.agent_id, payload.user_id).catch(() => { throw err });
        if (checktrasaction.length === 0) {
            if (payload.agent_id !== null && payload.agent_id !== '') {
                let withdraw_configs = await model.getwithdraw_config(req.body, JSON.parse(req.headers.payload)).catch(() => { throw err });
                let getbankweb = await model.getbankweb(req.body, JSON.parse(req.headers.payload)).catch(() => { throw err });
                console.log("user_id", payload.user_id)
                let member = await model.findbankmemb(payload.user_id).catch(() => { throw err });
                let profile = await functions.ProfilePD(member[0].mem_pd.memb_username, withdraw_configs[0]).catch(() => { throw err });
                let credit_balance = profile.result.result.data.balance
                let withdraw = req.body.balance
                if (withdraw <= credit_balance) {
                    let counter_config = withdraw_configs[0].counter
                    let Counter = await model.counttrasaction(payload.agent_id, payload.user_id).catch(() => { throw err }); counttrasaction_suceess
                    let counttrasaction_suceess = await model.counttrasaction_suceess(payload.agent_id, payload.user_id).catch(() => { throw err });
                    let cout = 0
                    if(Counter.length === 0){
                        cout = Number(Counter.length)+1
                    }else{
                        cout = Number(Counter.length)
                    }
                    let cout_s = 0
                    if(counttrasaction_suceess.length === 0){
                        cout_s = Number(counttrasaction_suceess.length)+1
                    }else{
                        cout_s = Number(counttrasaction_suceess.length)
                    }
                    let note = [{ username: "System", note: "จำนวนการถอนของวันที่"+ moment().format('YYYY-MM-DD')+" ครั้งที่ " + cout + "และจำนวนการถอนที่สำเร็จครั้งที่ " + cout_s, note_date: new Date(moment().format()) }]
                    console.log("Counter_config", Counter.length)
                    if (Counter.length <= counter_config) {
                        let min_config = withdraw_configs[0].min
                        let max_config = withdraw_configs[0].max
                        if (withdraw >= min_config) {
                            if (withdraw <= max_config) {
                                let getlastdeposit = await model.getlastdeposit(payload.agent_id, payload.user_id).catch(() => { throw err });
                                let turn = Double()
                                if(getlastdeposit.length !== 0){
                                    console.log("getlastdeposit", getlastdeposit)
                                    if(getlastdeposit[0].ref_id !== null){
                                        let checkturnover = await functions.checkturnover(member[0].mem_pd.memb_username, withdraw_configs[0], getlastdeposit[0].ref_id).catch(() => { throw err });
                                        //console.log(checkturnover.result.result.data)
                                        if(checkturnover.result.result.code === 100033){
                                            let note = [{ username: "System", note: "ไม่พบจำนวน turnover " ,note_date: new Date(moment().format())}]
                                        }else{
                                        const { hdp, mixParlay, mixStep, casino, slot, card, lotto, keno, trade, poker, } = checkturnover.result.result.data
                                        turn = Double(hdp.turn) + Double(mixParlay.turn) + Double(mixStep.turn) + Double(casino.turn) + Double(slot.turn) + Double(card.turn) + Double(lotto.turn) + Double(keno.turn) + Double(trade.turn) + Double(poker.turn)
                                        note = note.concat([{ username: "System", note: "turnover " + turn ,note_date: new Date(moment().format()) }])
                                        const winlose = Double(hdp.wl) + Double(mixParlay.wl) + Double(mixStep.wl) + Double(casino.wl) + Double(slot.wl) + Double(card.wl) + Double(lotto.wl) + Double(keno.wl) + Double(trade.wl) + Double(poker.wl)
                                        note = note.concat([{ username: "System", note: "winlose " + winlose ,note_date: new Date(moment().format()) }])
                                        }
                                    }
                                }
                                
                                let suspendstatus = await functions.changestatus(member[0].mem_pd.memb_username, withdraw_configs[0]).catch(() => { throw err });
                                let updatestatus = await model.updatestatus(payload).catch(() => { throw err });
                                if (suspendstatus.result.status === "200") {
                                    let OpenPO = await model.InsertDocWithdraw(payload, withdraw, member[0], getbankweb[0], note, turn).catch(() => { throw err });
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

