const model = require('../models/server.model');
const functions = require('../functions/server.function');

//const { urlencoded } = require("express");

//const _ = require("lodash");
module.exports.login = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
//console.log(JSON.parse(req.headers.payload))
    try {
        let ResultToken = await model.login(req.body,req.headers).catch(() => { throw err });
        // console.log(ResultMEMBER)
        //console.log("Test",ResultToken.profile_mem._id)
        if (ResultToken.token && ResultToken.token.length) {
             //console.log('Result',ResultToken)
            //const log = await functions.logs(req.body, req.headers.host).catch(() => { throw err });
            
            const find = await model.find_session(ResultToken.profile_mem._id).catch(() => { throw err });
           // console.log(find[0]._id)
            if(find.length > 0){
                const remove =   await model.remove_session(find[0]._id).catch(() => { throw err }); 
                if (remove.deletedCount > 0){
                    const inst_token =  await model.inserttoken(ResultToken).catch(() => { throw err });
                    if(inst_token.insertedId){
                            res.send({
                                status: "200",
                                message: "success",
                                ResultToken
                
                            }).end();
                        }else
                        {
                            res.send({ status: "201", message: 'Cannot Create Token Please try again' }).end();
                        }
                }
            }else{
                const inst_token =  await model.inserttoken(ResultToken).catch(() => { throw err });
                if(inst_token.insertedId){
                        res.send({
                            status: "200",
                            message: "success",
                            ResultToken
            
                        }).end();
                    }else
                    {
                        res.send({ status: "201", message: 'Cannot Create Token Please try again' }).end();
                    }
            }
            
        } else {
            res.send({ status: "202", message: 'not found data' }).end();
        }
    } catch (error) {
        //console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}