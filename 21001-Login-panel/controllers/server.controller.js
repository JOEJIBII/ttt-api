const model = require('../models/server.model');
const functions = require('../functions/server.function');
const { ObjectId } = require('mongodb');

//const { urlencoded } = require("express");

//const _ = require("lodash");
module.exports.login = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
//console.log("payload",JSON.parse(req.headers.payload))
//console.log("headers",req.headers)
//console.log(req.headers['user-agent'])
console.log("body",req.body)
    try {
        let ResultToken = await model.login(req.body).catch(() => { throw err });
         //console.log("result",ResultToken[0])
        //console.log("Test",ResultToken.profile_mem._id)
        
        if (ResultToken.length !== 0) {
             //console.log('Result',ResultToken)
            //console.log(credit)
                     let Token = model.gen_token(ResultToken[0])
                     const remove =   await model.remove_session(ResultToken[0]._id).catch(() => { throw err }); 
                    //  if (remove.deletedCount > 0){
                         const inst_token =  await model.inserttoken(ResultToken[0],Token.token).catch(() => { throw err });
                         if(inst_token.insertedId){
                            //let responses = await functions.Mappingdata(ResultToken,credit.result.result.data.balance).catch(() => {throw err});
                            //console.log("response",responses)
                                 res.send({
                                     status: "200",
                                     message: "success",
                                     result:{
                                        token:Token.token,
                                        profile_employee:ResultToken[0]
                                     }
                                     
                                     //credit:credit.result.result.data.balance
                                 }).end();
                             }else
                             {
                                 res.send({ status: "201", message: 'Cannot Create Token Please try again' }).end();
                             }
                    //  }
                 
        } else {
            res.send({ status: "202", message: 'not found data' }).end();
        }
    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}