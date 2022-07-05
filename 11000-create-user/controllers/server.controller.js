//const { ObjectID } = require('bson');
const { ObjectId, Logger } = require('mongodb');
const model = require('../models/server.model');
const functions = require('../functions/server.function');


module.exports.registermember = async function (req, res) {
    res.setHeader('Content-type', 'application/json');
    let body = req.body.body
    console.log(body)
    // const payload = JSON.parse(req.headers.payload)
    //console.log("ip",req.headers)

    try {
        //console.log(body.captchaID, body.value)
        let verifyCap = await functions.verifycaptcha(body.captchaID, body.value).catch(() => { throw err });

        if (verifyCap.status === "200") {
            let Ckbank = await model.CheckBankAccount(body).catch(() => { throw err });
            //console.log(Ckbank.length)
            let Cktel = await model.CheckTel(body).catch(() => { throw err });
            console.log(Ckbank.length)
            console.log(Cktel.length)
            if (Cktel.length === 0 && Ckbank.length === 0) {
                const CONF = await model.findConF(body).catch(() => { throw err });
                console.log("cof",CONF.value)
                if (CONF.value !== null) {
                    const userTemp = CONF.value.provider.prov_agentusername + CONF.value.prefix + CONF.value.member.running_number
                    console.log("userTemp",userTemp)
                    let Result = await model.register(body,CONF.value.prefix + CONF.value.member.running_number).catch(() => { throw err });
                    console.log("Result",Result)
                    if (Result.insertedId !== null && Result.insertedId !== '') {
                        let membbank = await model.insertbankmemb(Result.insertedId, body).catch(() => { throw err });
                        console.log("bank", membbank)
                        let membturnover = await model.insertmembturnover(Result.insertedId, body).catch(() => { throw err });
                        console.log("turnover", membturnover)
                        const createacct = await model.createaccountprovider(body, Result.insertedId, CONF, userTemp).catch(() => { throw err });
                        await model.get_acct_pd(createacct.insertedId).catch(() => { throw err });
                        await functions.logs(body, Result.insertedId, req.headers.host).catch(() => { throw err });
                        const regis = await functions.registermemberPD(CONF, userTemp).catch(() => { throw err });
                        console.log("regis",regis)
                        if (regis.result.code === 0) {
                            res.send({
                                status: "200",
                                message: "success",
                                Username: body.tel,
                                Password: regis.Password,
                                username_prov: regis.acct,
                            }).end();
                        } else {
                            console.log(createacct.insertedId)
                            console.log(Result.insertedId)
                            const delete_mem = await model.removemember(Result.insertedId).catch(() => { throw err });
                            console.log(delete_mem)
                            if (delete_mem.deletedCount === 1) {
                                const delete_mem_pd = await model.removememberpd(createacct.insertedId).catch(() => { throw err });
                                console.log(delete_mem_pd)
                            }
                            res.send({ result: regis.result }).end();
                        }

                    } else {
                        res.send({ status: "201", message: "Cannot Insert data" }).end();
                    }
                } else {
                    res.send({ status: "202", message: "Not Found domain" }).end();
                }

            } else {
                if (Cktel.length !== 0 && Ckbank.length !== 0) {
                    res.send({
                        status: "203",
                        bank_account:
                        {
                            bank_acct: body.bank_acct,

                        },
                        tel: body.tel,
                        message: "PhoneNumber และ BankAccount มีอยู่ในระบบแล้ว"
                    }).end();
                } else {
                    if (Cktel.length == 0 && Ckbank.length !== 0) {
                        res.send({
                            status: "204",
                            bank_account:
                            {
                                bank_acct: body.bank_acct,

                            },
                            message: "BankAccount มีอยู่ในระบบแล้ว"
                        }).end();
                    } else {
                        if (Cktel.length !== 0 && Ckbank.length == 0) {
                            res.send({
                                status: "205",
                                tel: body.tel,
                                message: "PhoneNumber มีอยู่ในระบบแล้ว"
                            }).end();
                        }
                    }
                }

            }
        } else {
            res.send({
                status: verifyCap.status,
                message: verifyCap.message
            }).end();
        }

    } catch (error) {
        //console.log(error);
        res.send({ status: "400", message: error }).end();
    }

}

