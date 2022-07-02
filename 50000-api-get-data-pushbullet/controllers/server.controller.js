const { CronJob } = require("cron");
const ObjectDriver = new Map();
const _ = require("lodash");

const fx = require("../functions/server.function");
const model = require("../models/server.model");

var working = false;

module.exports = async () => {
    // new CronJob("0 */1 * * * *", async () => {
    try {
        if (!working) {
            working = true;
            for await (const i of await model.getPushBulletData()) {
                let { _id } = i;
                _id = (_id).toString();
                ObjectDriver.set(_id, i);
                await mainProcess(ObjectDriver.get(_id));
            }
            working = false;
        }
    } catch (error) {
        console.error("main process error on ", new Date().toISOString());
        console.error(error);
        working = false;
    }
    // }, null, true);
}

const mainProcess = data => {
    return new Promise(async (resolve, reject) => {
        try {
            const { _id, name, token } = data;
            let WebSocketClient = require("websocket").client;
            let Client = new WebSocketClient();
            Client.on("connectFailed", async error => {
                console.log("connectFailed : " + name);
                await model.updateStatus(_id, "000");
            });
            Client.on("connect", async connection => {
                console.log("websocket connect success : " + name);
                // await model.updateStatus(_id, "001");
                connection.on("error", async error => {
                    console.error("websocket error : " + name);
                    console.error("desription : " + error.toString());
                    await model.updateStatus(_id, "000");
                });
                connection.on("close", async () => {
                    console.error("websocket close : " + name);
                    await model.updateStatus(_id, "000");
                });
                connection.on("message", async message => {
                    console.log("incoming message : ", message);
                    if (message.type === "utf8") {
                        message = JSON.parse(message.utf8Data);
                        if (message.type === "push") {
                            const { type, title, body, application_name: application } = message.push;
                            if (type === "mirror" && !_.isEmpty(title) && !_.isEmpty(body)) {
                                // now is not collected push message from any application.
                                 console.log("message from appclication");
                                 console.log("body",body);
                                 console.log("type",type);
                                let otp = body.match(/otp/g);
                                let OTP = body.match(/OTP/g);
                                if (otp || OTP) {
                                    let msg = {
                                        agent_id: data.agent,
                                        type: "OTP",
                                        title,
                                        body,
                                        application,
                                        ref:null,
                                        value: null
                                    };
                                    if (title === '⁨027777777⁩') {
                                        let str = title;
                                        let startIdx = str.indexOf("<OTP ");
                                        str = str.substring(startIdx + 5);
                                        let endIdx = str.indexOf(">");
                                        str = str.substring(0, endIdx);
                                        msg.value = str;

                                    } else if (title === 'ttbbank') {
                                        let var_array
                                        let var_array1
                                        var_array = body.split("\=");
                                        var_array1 = var_array[1].trim().split("\,");
                                        let ref = var_array1[0];
                                        let otp = var_array[2].trim();
                                        msg.value = otp;
                                        msg.ref = ref;
                                        // let str = body;
                                        // let startIdx = str.indexOf("Bank Ref= ");
                                        // str = str.substring(startIdx + 4);
                                        // let endIdx = str.indexOf(",");
                                        // str = str.substring(0, endIdx);
                                        // msg.ref = str;
                                        // let otp = body;
                                        // let startIdx_otp = otp.indexOf("OTP= ");
                                        // otp = otp.substring(startIdx_otp + 6);
                                        // let endIdx_otp = otp.indexOf(",");
                                        // otp = otp.substring(0, endIdx_otp);
                                        // msg.value = otp;
                                    }
                                    await model.insertMsg(msg);
                                    console.log("message inseted")
                                }else if(title === '⁨KBank⁩'){
                                    let msg = {
                                        agent_id: data.agent,
                                        type: "sms",
                                        title,
                                        body,
                                        application,
                                        value: null
                                    };
                                    await model.insertMsg(msg);
                                    console.log("message inseted")
                                 }
                                else{
                                    let msg = {
                                        agent_id: data.agent,
                                        type: "other",
                                        title,
                                        body,
                                        application,
                                        value: null
                                    };
                                    await model.insertMsg(msg);
                                    console.log("message inseted")
                                }
                            } else if (type === "sms_changed") {
                                 console.log("sms changed message : ", message);
                            }
                        } else {
                            console.log("utf8Data type is not push");
                        }
                    } else {
                        console.log("message type is not utf8");
                    }
                });
            });
            Client.connect(`wss://stream.pushbullet.com/websocket/${token}`);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
}

// const

module.exports.a = () => {
    const data = { _id: "xxxxx", name: "chutinut.j@gmail.com", iden: "ujDgUctqBtk", password: "12345678", token: "o.fD6QZLPS4QY95wxcJclmgZoBvzMJn3qC" }
    //--------------------------------------------
    var WebSocketClient = require("websocket").client;
    var client = new WebSocketClient();
    // client.on("connectFailed", async function (error) {
    //     console.log("connectFailed Error: " + error.toString());
    //     // await model.updateStatus(data._id, "000");
    // });
    client.on("connect", function (connection) {
        console.log(`WebSocket Client Connected BY :: ${data.name}`);
        connection.on("error", async function (error) {
            console.log("Connection Error: " + error.toString());
            // await model.updateStatus(data._id, "000");
        });
        connection.on("close", async function () {
            console.log(`Connection Closed BY : ${data.name}`);
            // await model.updateStatus(data._id, "000");
        });
        connection.on("message", async function (message) {
            console.log(`Inprogress Connection :: ${data.name}`);
            // let checkActive = await model.find_data_active_noti(data._id);
            // if (!checkActive.status) {
            //     console.log(`client close : ${data.name}`);
            //     connection.close();
            // } else {
            if (message.type === "utf8") {
                var res = JSON.parse(message.utf8Data);
                if (res.type == "push") {
                    // Push - filter
                    console.log("message  : ", {
                        type: res.type,
                        title: res.push.title,
                        body: res.push.body,
                        application: res.push.application_name
                    })
                    if (resmsg.type == "mirror" && resmsg.title != undefined && resmsg.body != undefined) {
                        // let objMirror = {};
                        // objMirror.title = resmsg.title;
                        // objMirror.body = resmsg.body;
                        // objMirror.app_name = resmsg.application_name;
                        // objMirror.type = "normal";
                        // objMirror.date = new Date();
                        // await model.insert_data_sms(data, objMirror);
                    } else if (resmsg.type == "sms_changed") {
                        console.log("SMM_CHANGED");
                        console.log(resmsg);
                        let objDataSms = {};
                        for (const obj of resmsg.notifications) {
                            objDataSms.title = obj.title;
                            objDataSms.body = obj.body;
                            objDataSms.date = new Date(Number(obj.timestamp + "000"));
                        }
                        if (objDataSms.body && objDataSms.title && objDataSms.date) {
                            let str = objDataSms.body;
                            let otp = str.match(/otp/g);
                            let OTP = str.match(/OTP/g);
                            if (otp || OTP) {
                                objDataSms.type = "otp"
                            } else {
                                objDataSms.type = "normal"
                            }
                            if (objDataSms.title == "027777777") {
                                if (objDataSms.body.indexOf("เข้าx") > -1 && objDataSms.body.indexOf("@") == 5) {
                                    objDataSms.deposit_decrypt = "1";
                                }
                            }
                            if (objDataSms.title == "KBank") {
                                if (objDataSms.body.indexOf("Outstanding") > -1 && objDataSms.body.indexOf("A/C") > - 1) {
                                    objDataSms.deposit_decrypt = "1";
                                }
                                if (objDataSms.body.indexOf("received") > -1 && objDataSms.body.indexOf("A/C") > - 1) {
                                    objDataSms.deposit_decrypt = "1";
                                }
                                if (objDataSms.body.indexOf("Deposit") > -1 && objDataSms.body.indexOf("A/C") > - 1) {
                                    objDataSms.deposit_decrypt = "1";
                                }
                            }
                            if (objDataSms.title == "Krungthai") {
                                if (objDataSms.body.indexOf(":เงินเข้า") > -1 && objDataSms.body.indexOf("@") > - 1) {
                                    objDataSms.deposit_decrypt = "1";
                                }
                            }
                            if (objDataSms.title == "Wave Money") {
                                if (objDataSms.body.indexOf("WaveMoney") == 0 && objDataSms.body.indexOf("Trx ID") > - 1) {
                                    objDataSms.wave_money_status = "0";
                                }
                            }
                            console.log(`get sms success : ${data.name}`);
                            await model.insert_data_sms(data, objDataSms);
                        }
                    }
                }
            }
            // }
        });
    });
    client.connect(`wss://stream.pushbullet.com/websocket/${data.token}`);
}