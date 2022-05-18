//const { ObjectID } = require('bson');
const { ObjectId } = require('mongodb');
const model = require('../models/server.model');
const functions = require('../functions/server.function');
//const _ = require("lodash");

module.exports.registermember = async function (req,res) {
    res.setHeader('Content-type', 'application/json');
    try{
        req.headers["x-real-ip"]
        let Ckbank = await model.CheckBankAccount(req.body).catch(() => {throw err});
        let Cktel = await model.CheckTel(req.body).catch(() => {throw err});
            if(Cktel.length == 0 && Ckbank.length == 0){
                const CONF = await model.findConF(req.body).catch(() => {throw err});
                //console.log(CONF);
                if(CONF.value !== null){
                    let Result = await model.register(req.body,req.headers.host).catch(() => {throw err});
                    if(Result.insertedId !== null && Result.insertedId !== '') {
                        const createacct = await model.createaccountprovider(req.body,Result.insertedId,CONF).catch(() => {throw err});
                        const acct_pd = await model.get_acct_pd(createacct.insertedId).catch(() => {throw err});
                        const log = await functions.logs(req.body,Result.insertedId,req.headers.host).catch(() => {throw err});
                        res.send({
                            status: "200",
                            Username: req.body.username,
                            Password: req.body.Password,
                            username_prov : acct_pd.username,
                            message: "success"
                        }).end();
                    }else{
                        res.send({ status: "201", message: "Cannot Insert data" }).end();
                    }
                }else{
                    res.send({ status: "202", message: "Not Found domain" }).end();
                }
               
            }else{
                if(Cktel.length !== 0   &&  Ckbank.length !== 0 ){
                    res.send({
                        status: "203",
                        bank_account: req.body.banking_account.map(e => {
                            return {
                                bank_acct: e.bank_acct,
                                bank_name: e.bank_name,
                                bank_code: e.bankcode,
                            }
                        }),
                        tel: req.body.tel,
                        message: "PhoneNumber และ BankAccount มีอยู่ในระบบแล้ว"
                    }).end();
                }else{
                    if(Cktel.length == 0  && Ckbank.length !== 0){
                        res.send({
                            status: "204",
                            bank_account: req.body.banking_account.map(e => {
                                return {
                                    bank_acct: e.bank_acct,
                                    bank_name: e.bank_name,
                                    bank_code: e.bankcode,
                                }
                            }),
                            message: "BankAccount มีอยู่ในระบบแล้ว"
                        }).end();
                    }else{
                        if(Cktel.length !== 0  && Ckbank.length == 0){
                            res.send({
                                status: "205",
                                tel: req.body.tel,
                                message: "PhoneNumber มีอยู่ในระบบแล้ว"
                            }).end();
                        }
                    }
                }
                
            }
        }catch (error){
            //console.error(error);
            res.send({ status: "300", message: error }).end();
        }

}

