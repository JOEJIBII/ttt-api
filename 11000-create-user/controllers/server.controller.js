//const { ObjectID } = require('bson');
const { ObjectId, Logger } = require('mongodb');
const model = require('../models/server.model');
const functions = require('../functions/server.function');


module.exports.registermember = async function (req,res) {
    res.setHeader('Content-type', 'application/json');
    let body = req.body.body
    try{
        // const CONF = await model.findConF(body).catch(() => {throw err});
        // const regis = await functions.registermemberPD2(CONF).catch(() => {throw err});
        // console.log(regis)
        // console.log(err)
        req.headers["x-real-ip"]
        let Ckbank = await model.CheckBankAccount(body).catch(() => {throw err});
        let Cktel = await model.CheckTel(body).catch(() => {throw err});
        
        const verifyCap = await functions.verifycaptcha(body.captchaID,body.value).catch(() => {throw err});
       // console.log(err)
       // console.log(verifyCap)
        if(verifyCap.status === "200"){
            if(Cktel.length == 0 && Ckbank.length == 0){
                const CONF = await model.findConF(body).catch(() => {throw err});
               if(CONF.value !== null){
                //console.log(CONF);
                const userTemp = CONF.value.provider.prov_agentusername + CONF.value.prefix + CONF.value.member.running_number
                //console.log(userTemp);
                   let Result = await model.register(body,req.headers.host,CONF.value.prefix + CONF.value.member.running_number ).catch(() => {throw err});
                   if(Result.insertedId !== null && Result.insertedId !== '') {
                        const createacct = await model.createaccountprovider(body,Result.insertedId,CONF,userTemp).catch(() => {throw err});
                        const acct_pd = await model.get_acct_pd(createacct.insertedId).catch(() => {throw err});
                        //console.log(acct_pd)
                        const log = await functions.logs(body,Result.insertedId,req.headers.host).catch(() => {throw err});
                        const regis = await functions.registermemberPD(CONF,userTemp).catch(() => {throw err});
                         console.log("regis",regis)
                        if(regis.result.code === 0){
                            res.send({
                                status: "200",
                                Username: body.tel,
                                Password: regis.Password,
                                username_prov : regis.acct,
                                message: "success"
                            }).end();
                        }else{
                            console.log(createacct.insertedId)
                            console.log(Result.insertedId)
                            const delete_mem = await model.removemember(Result.insertedId).catch(() => {throw err});
                            console.log(delete_mem)
                            if(delete_mem.deletedCount === 1){
                                const delete_mem_pd = await model.removememberpd(createacct.insertedId).catch(() => {throw err});
                                console.log(delete_mem_pd)
                            }
                            res.send({result:regis.result }).end();
                        }
                        
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
                        bank_account: body.banking_account.map(e => {
                            return {
                                bank_acct: e.bank_acct,
                                bank_name: e.bank_name,
                                bank_code: e.bankcode,
                            }
                        }),
                        tel: body.tel,
                        message: "PhoneNumber และ BankAccount มีอยู่ในระบบแล้ว"
                    }).end();
                }else{
                    if(Cktel.length == 0  && Ckbank.length !== 0){
                        res.send({
                            status: "204",
                            bank_account: body.banking_account.map(e => {
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
                                tel: body.tel,
                                message: "PhoneNumber มีอยู่ในระบบแล้ว"
                            }).end();
                        }
                    }
                }
                
            }
        }else{
            res.send({
                status:verifyCap.status,
                message:verifyCap.message
            }).end();
        }
            
        }catch (error){
            //console.log(error);
            res.send({ status: "400", message: error}).end();
        }

}

