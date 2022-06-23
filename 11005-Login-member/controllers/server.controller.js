const model = require('../models/server.model');
const functions = require('../functions/server.function');

//const { urlencoded } = require("express");

//const _ = require("lodash");
module.exports.login = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    //console.log("payload",JSON.parse(req.headers.payload))
    //console.log("headers",req.headers)
    //console.log(req.headers['user-agent'])
    try {
        let ResultToken = await model.login(req.body, req.headers).catch(() => { throw err });
        //console.log(ResultToken)
        //console.log("Test",ResultToken.profile_mem._id)
        if (ResultToken.length !== 0) {
            //console.log('Result', ResultToken)
            let Token = model.gen_token(ResultToken[0])
            const credit = await functions.ProfilePD(ResultToken[0].username).catch(() => { throw err });
            //console.log(Token)
            if (credit.result.status === "200") {
                const find = await model.find_session(ResultToken[0]._id).catch(() => { throw err });
                // console.log(find[0]._id)
                if (find.length > 0) {
                    const remove = await model.remove_session(find[0]._id).catch(() => { throw err });
                    if (remove.deletedCount > 0) {
                        const inst_token = await model.inserttoken(ResultToken, Token).catch(() => { throw err });
                        if (inst_token.insertedId) {
                            let responses = await functions.Mappingdata(ResultToken, credit.result.result.data.balance, Token).catch(() => { throw err });
                            //console.log(responses)
                            res.send({
                                status: "200",
                                message: "success",
                                result: responses
                                //credit:credit.result.result.data.balance
                            }).end();
                        } else {
                            res.send({ status: "201", message: 'Cannot Create Token Please try again' }).end();
                        }
                    }
                } else {
                    const inst_token = await model.inserttoken(ResultToken, Token).catch(() => { throw err });
                    if (inst_token.insertedId) {
                        let responses = await functions.Mappingdata(ResultToken, credit.result.result.data.balance, Token).catch(() => { throw err });
                        res.send({
                            status: "200",
                            message: "success",
                            result: responses

                        }).end();
                    } else {
                        res.send({ status: "201", message: 'Cannot Create Token Please try again' }).end();
                    }
                }
            } else {
                res.send({ status: "203", message:"amb " + credit.result.message.msg }).end();
            }
        } else {
            res.send({ status: "202", message: 'not found data' }).end();
        }
    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}