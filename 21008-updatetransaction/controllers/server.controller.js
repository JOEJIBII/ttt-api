const model = require('../models/server.model');
const functions = require('../functions/server.function');
const moment = require('moment');

//const { urlencoded } = require("express");

//const _ = require("lodash");
module.exports.updatetransaction = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    req.headers["x-real-ip"]
    const payload = JSON.parse(req.headers.payload)
    const body = req.body
    try {

        if (body.type === "withdraw") {
            let checkpermission = await model.getdocument(body).catch(() => { throw err });
            let note = checkpermission[0].description
            if (body.description !== null && body.description !== "") {
                if (note === null) {
                    note = []
                    note = note.concat([{ username: payload.username, note: body.description, note_date: new Date(moment().format()) }])
                } else {
                    note = note.concat([{ username: payload.username, note: body.description, note_date: new Date(moment().format()) }])
                }

            }
            if (checkpermission[0].lock_status === "lock") {
                if (checkpermission[0].lock_by.toString() === payload.user_id.toString()) {
                    if (body.status === "check" || body.status === "save") {
                        let updatecheck = await model.updatechecked(body, payload, note).catch(() => { throw err });
                        let updatelock = await model.updatelock(body, payload).catch(() => { throw err });
                        res.send({
                            status: "200",
                            message: "success",
                            result: updatecheck
                        }).end();
                    } else {
                        if (body.status === "approve") {
                            let getdocument = await model.getdocument(body).catch(() => { throw err });
                            //console.log(getdocument[0])
                            let getconfig_pd = await model.getconfig_pd(getdocument[0].agent_id).catch(() => { throw err });
                            let getmembpd = await model.getmembpd(body.memb_id).catch(() => { throw err });
                            //let updateturnover = await model.updateturnover(getdocument[0].memb_id,getdocument[0].agent_id,getdocument[0].amount,getdocument[0].description).catch(() => { throw err });
                            let withdrawPD = await functions.withdraw(getconfig_pd[0], getmembpd[0].username, getdocument[0].amount).catch(() => { throw err });
                            if (withdrawPD.result.code === 0) {
                                await model.updatecredit(getdocument[0].agent_id, withdrawPD.result.data.agent.afterCredit, payload).catch(() => { throw err });
                                await model.updaterefid(body.doc_id, withdrawPD.result.refId, payload, body.type).catch(() => { throw err });
                                let getmemb = await model.getmemb(getdocument[0].memb_id).catch(() => { throw err });
                                //console.log("-----------------------",getmemb[0].financial.withdraw_first_time)
                                if (getmemb[0].financial.withdraw_first_time === null || getmemb[0].financial.withdraw_first_time === "0") {

                                    await model.updateapprove(body, payload, note, getdocument[0]).catch(() => { throw err });
                                    await model.update_financial_withdraw_first(getdocument[0].memb_id, getdocument[0].amount, payload).catch(() => { throw err });
                                    console.log(getmembpd[0].username, getconfig_pd[0])
                                    let updatemember = await model.updatemember(getdocument[0].memb_id, payload).catch(() => { throw err });
                                    let updatelock = await model.updatelock(body, payload).catch(() => { throw err });
                                    let changestatus = await functions.changestatus(getmembpd[0].username, getconfig_pd[0]).catch(() => { throw err });
                                    res.send({
                                        status: "200",
                                        message: "success",
                                        credit_web: withdrawPD.result.data.agent.afterCredit
                                    }).end();
                                } else {
                                    await model.updateapprove(body, payload, note, getdocument[0]).catch(() => { throw err });
                                    await model.update_financial_withdraw(getdocument[0].memb_id, getdocument[0].amount, payload).catch(() => { throw err });
                                    let updatelock = await model.updatelock(body, payload).catch(() => { throw err });
                                    let updatemember = await model.updatemember(getdocument[0].memb_id, payload).catch(() => { throw err });
                                    let changestatus = await functions.changestatus(getmembpd[0].username, getconfig_pd[0]).catch(() => { throw err });
                                    //await model.update_financial(getdocument[0].memb_id,getdocument[0].amount,payload).catch(() => { throw err });
                                    res.send({
                                        status: "200",
                                        message: "success",
                                        credit_web: withdrawPD.result.data.agent.afterCredit
                                    }).end();
                                }
                            }
                        } else {
                            if (body.status === "cancel") {
                                let getdocument = await model.getdocument(body).catch(() => { throw err });
                                //console.log(getdocument[0])updatemember
                                let getconfig_pd = await model.getconfig_pd(getdocument[0].agent_id).catch(() => { throw err });
                                let getmembpd = await model.getmembpd(getdocument[0].memb_id).catch(() => { throw err });
                                let updatereject = await model.updatereject(body, payload, note).catch(() => { throw err });
                                let updatemember = await model.updatemember(getdocument[0].memb_id, payload).catch(() => { throw err });
                                let updatelock = await model.updatelock(body, payload).catch(() => { throw err });
                                let changestatus = await functions.changestatus(getmembpd[0].username, getconfig_pd[0]).catch(() => { throw err });
                                res.send({
                                    status: "200",
                                    message: "success",
                                    result: updatereject.modifiedCount
                                }).end();
                            } else {
                                if (body.status === "close") {
                                    let updatelock = await model.updatelock(body, payload).catch(() => { throw err });
                                    res.send({
                                        status: "200",
                                        message: "success",
                                        result: "close success"
                                    }).end();
                                } else {
                                    if (body.status === "retry") {
                                        let getdocument = await model.getdocument(body).catch(() => { throw err });
                                        let updateretry = await model.updateretry(body, payload, note, getdocument[0].retry_count).catch(() => { throw err });
                                        res.send({
                                            status: "200",
                                            message: "success",
                                            result: "retry success"
                                        }).end();
                                    } else {
                                        if(body.status === "manual"){
                                            updatemanual
                                            let getdocument = await model.getdocument(body).catch(() => { throw err });
                                            let updatemanual = await model.updatemanual(body, payload, note).catch(() => { throw err });
                                            res.send({
                                                status: "200",
                                                message: "success",
                                                result: "manual success"
                                            }).end();
                                        }
                                        res.send({
                                            status: "202",
                                            message: "ขอมูลไม่ถูกต้อง",
                                            result: ""
                                        }).end();
                                    }
                                }
                            }
                        }
                    }
                } else {
                    res.send({
                        status: "200",
                        message: "งานนี้ไม่ใช่ของคุณแล้ว",
                    }).end();
                }
            } else {
                res.send({
                    status: "200",
                    message: "งานนี้ไม่ได้ lock อยู่",
                }).end();
            }
        } else {
            if (body.type === "deposit") {

                let checkpermission = await model.getdocument(body).catch(() => { throw err });
                let note = checkpermission[0].description
                if (body.description !== null && body.description !== "") {
                    if (note === null) {
                        note = []
                        note = note.concat([{ username: payload.username, note: body.description, note_date: new Date(moment().format()) }])
                    } else {
                        note = note.concat([{ username: payload.username, note: body.description, note_date: new Date(moment().format()) }])
                    }

                }
                if (checkpermission[0].lock_status === "lock") {
                    if (checkpermission[0].lock_by.toString() === payload.user_id.toString()) {
                        if (body.status === "check" || body.status === "save") {
                            let updatecheck = await model.updatechecked(body, payload, note).catch(() => { throw err });
                            let updatelock = await model.updatelock(body, payload).catch(() => { throw err });
                            res.send({
                                status: "200",
                                message: "success",
                                result: updatecheck
                            }).end();
                        } else {
                            if (body.status === "approve") {
                                let getdocument = await model.getdocument(body).catch(() => { throw err });
                                let getconfig_pd = await model.getconfig_pd(getdocument[0].agent_id).catch(() => { throw err });
                                let getmembpd = await model.getmembpd(body.memb_id).catch(() => { throw err });
                                let updateturnover = await model.updateturnover(body.memb_id, getdocument[0].agent_id, getdocument[0].amount, getdocument[0].description).catch(() => { throw err });
                                let depositPD = await functions.depositPD(getconfig_pd[0], getmembpd[0].username, getdocument[0].amount).catch(() => { throw err });
                                console.log(depositPD)
                                if (depositPD.result.code === 0) {

                                    await model.updatecredit(getdocument[0].agent_id, depositPD.result.data.agent.afterCredit, payload).catch(() => { throw err });
                                    await model.updaterefid(body.doc_id, depositPD.result.data.refId, payload, body.type).catch(() => { throw err });

                                    if (updateturnover.modifiedCount === 0) {
                                        await model.upsertturnover(body.memb_id, getdocument[0].agent_id, getdocument[0].amount, getdocument[0].description).catch(() => { throw err });
                                    }
                                    let getmemb = await model.getmemb(body.memb_id).catch(() => { throw err });
                                    if (getmemb[0].financial.deposit_first_time === null || getmemb[0].financial.deposit_first_time === "0") {
                                        await model.updateapprove(body, payload, note, getdocument[0]).catch(() => { throw err });
                                        await model.update_financial_first(body.memb_id, getdocument[0].amount, payload).catch(() => { throw err });
                                        let updatelock = await model.updatelock(body, payload).catch(() => { throw err });
                                        let changestatus = await functions.changestatus(getmembpd[0].username, getconfig_pd[0]).catch(() => { throw err });
                                        res.send({
                                            status: "200",
                                            message: "success",
                                            credit_web: depositPD.result.data.agent.afterCredit
                                        }).end();
                                    } else {
                                        if (getdocument.length > 1) {
                                            let updatelastdeposit = await model.updatelastdeposit(getdocument[1]._id).catch(() => { throw err });
                                        }
                                        await model.updateapprove(body, payload, note, getdocument[0]).catch(() => { throw err });
                                        await model.update_financial(getdocument[0].memb_id, getdocument[0].amount, payload).catch(() => { throw err });
                                        //await model.update_financial(getdocument[0].memb_id,getdocument[0].amount,payload).catch(() => { throw err });
                                        let updatelock = await model.updatelock(body, payload).catch(() => { throw err });
                                        let changestatus = await functions.changestatus(getmembpd[0].username, getconfig_pd[0]).catch(() => { throw err });
                                        res.send({
                                            status: "200",
                                            message: "success",
                                            credit_web: depositPD.result.data.agent.afterCredit
                                        }).end();
                                    }
                                }
                            } else {
                                if (body.status === "cancel") {
                                    let getdocument = await model.getdocument(body).catch(() => { throw err });
                                    let getconfig_pd = await model.getconfig_pd(getdocument[0].agent_id).catch(() => { throw err });
                                    let getmembpd = await model.getmembpd(body.memb_id).catch(() => { throw err });
                                    let updatereject = await model.updatereject(body, payload, note).catch(() => { throw err });
                                    let updatelock = await model.updatelock(body, payload).catch(() => { throw err });
                                    if (getdocument[0].memb_id !== null) {
                                        let changestatus = await functions.changestatus(getmembpd[0].username, getconfig_pd[0]).catch(() => { throw err });
                                    }
                                    res.send({
                                        status: "200",
                                        message: "success",
                                        result: updatereject.modifiedCount
                                    }).end();
                                } else {
                                    if (body.status === "close") {
                                        let updatelock = await model.updatelock(body, payload).catch(() => { throw err });
                                        res.send({
                                            status: "200",
                                            message: "success",
                                            result: "close success"
                                        }).end();
                                    } else {
                                        res.send({
                                            status: "202",
                                            message: "ขอมูลไม่ถูกต้อง",
                                        }).end();
                                    }
                                }
                            }
                        }

                    } else {
                        res.send({
                            status: "200",
                            message: "งานนี้ไม่ใช่ของคุณแล้ว",
                        }).end();
                    }
                } else {
                    res.send({
                        status: "200",
                        message: "งานนี้ไม่ได้ lock อยู่",
                    }).end();
                }

            } else {
                res.send({
                    status: "201",
                    message: "not available type",
                    // result : updatecheck
                }).end();
            }
        }



    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}

