//const { ObjectID } = require('bson');
const { ObjectId, Logger } = require('mongodb');
const model = require('../models/server.model');
const functions = require('../functions/server.function');


module.exports.registermember = async function (req, res) {
    res.setHeader('Content-type', 'application/json');
    let body = req.body.body
    try {
        let Ckbank = await model.CheckBankAccount(body).catch(() => { throw err });
        let Cktel = await model.CheckTel(body).catch(() => { throw err });
        if (Cktel.length === 0 && Ckbank.length === 0) {
            const CONF = await model.findConF(body).catch(() => { throw err });
            if (CONF.value !== null) {
                const userTemp = CONF.value.provider.prov_agentusername + CONF.value.prefix + CONF.value.member.running_number
                console.log("userTemp",userTemp)
                let Result = await model.register(body, req.headers.host, CONF.value.prefix + CONF.value.member.running_number).catch(() => { throw err });
                if (Result.insertedId !== null && Result.insertedId !== '') {
                    let membbank = await model.insertbankmemb(Result.insertedId, body).catch(() => { throw err });
                    console.log("bank", membbank)
                    let membturnover = await model.insertmembturnover(Result.insertedId, body).catch(() => { throw err });
                    console.log("turnover", membturnover)
                    const createacct = await model.createaccountprovider(body, Result.insertedId, CONF, userTemp).catch(() => { throw err });
                    await model.get_acct_pd(createacct.insertedId).catch(() => { throw err });
                    await functions.logs(body, Result.insertedId, req.headers.host).catch(() => { throw err });
                    const regis = await functions.registermemberPD(CONF, userTemp,body.name,body.surename).catch(() => { throw err });
                    if (regis.result.code === 0) {
                        console.log(Result.insertedId, body)
                        let getdetailmember = await model.getdetailmember(Result.insertedId, body).catch(() => { throw err });
                        console.log(getdetailmember)
                        console.log(getdetailmember[0])
                        res.send({
                            status: "200",
                            message: "success",
                            result: getdetailmember[0]

                        }).end();
                    } else {
                        console.log(createacct.insertedId)
                        console.log(Result.insertedId)
                        const delete_mem = await model.removemember(Result.insertedId).catch(() => { throw err });
                        await model.removemember_turnover(Result.insertedId).catch(() => { throw err });
                        await model.removebankmemb(Result.insertedId).catch(() => { throw err });
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
                    message: "PhoneNumber ????????? BankAccount ????????????????????????????????????????????????"
                }).end();
            } else {
                if (Cktel.length == 0 && Ckbank.length !== 0) {
                    res.send({
                        status: "204",
                        bank_account:
                        {
                            bank_acct: body.bank_acct,

                        },
                        message: "BankAccount ????????????????????????????????????????????????"
                    }).end();
                } else {
                    if (Cktel.length !== 0 && Ckbank.length == 0) {
                        res.send({
                            status: "205",
                            tel: body.tel,
                            message: "PhoneNumber ????????????????????????????????????????????????"
                        }).end();
                    }
                }
            }

        }

    } catch (error) {
        //console.log(error);
        res.send({ status: "400", message: error }).end();
    }

}

