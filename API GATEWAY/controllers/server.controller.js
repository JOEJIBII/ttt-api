const { request } = require("express");
const _ = require("lodash");
const fx = require("../functions/server.function");
const model = require("../models/server.model");
const JWT_ERROR = { "TokenExpiredError": {status: "502", message: "Token expired" }, "jsonWebTokenError": {status: "501", message: "Token Unauthorized"} }

module.exports = async (request, response) => {
    //console.log(request,response)
    try {
            let token = await fx.get(request.headers);
            console.log(token)
            if(!_.isNull(token)) {
                    let payload = await fx.decode(token);
                    console.log(payload)
                    if(!_.isNull(payload)) {
                        // let exists = (await model.get(payload.ou, payload.branch, token))[0];
                        //     if(!_.isEmpty(exists)) {
                        //         let { sKey } = exists;
                                    let sKey  = "bp888";
                                    //console.log("verify")
                                    //console.log(token,sKey);
                                 let verify = await fx.verify(token, sKey);
                                 
                                 console.log("verify",verify)
                                 if(_.isEqual(verify.status, true)) {
                                         // console.log("request",request)
                                          //console.log("payload",payload)
                                    let result = await fx.send(request, payload);
                                    console.log("result",result)
                                    response.send(result).end();
                                }else{
                                     response.send(JWT_ERROR[verify.error]).end();
                             }
                        //     }else{
                        //         response.send({ status: "503", message: "token not registered" }).end();
                        //     }
                    }else{
                        response.send({ status: "504", message: "wrong token" }).end();
                    }
            }else{
                response.send({ status: "100", message: "invalid token" }).end();
            }
    }catch (error){
       console.log(error)
        response.send({ status: "500", message: "internal server error Gatway" }).end(); 
    }
}