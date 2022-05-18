const { request } = require("express");
const _ = require("lodash");
const fx = require("../functions/server.function");
const model = require("../models/server.model");
const JWT_ERROR = { "TokenExpireError": {status: "502", message: "Token expired" }, "jsonWebTokenError": {status: "501", message: "Token Unauthorized"} }

module.exports = async (request, response) => {
    try {
            let token = await fx.get(request.headers);
            if(!_.isNull(token)) {
                    let payload = await fx.decode(token);
                    if(!_.isNull(payload)) {
                        // let exists = (await model.get(payload.ou, payload.branch, token))[0];
                        //     if(!_.isEmpty(exists)) {
                        //         let { sKey } = exists;
                        //         let verify = await fx.verify(token, sKey);
                        //         if(_.isEqual(verify.status, true)) {
                                    let result = await fx.send(request, payload);
                                    response.send(result).end();
                        //         }else{
                        //             response.send(JWT_ERROR[verify.error]).end();
                        //         }
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
        response.send({ status: "500", message: "internal server error" }).end(); 
    }
}