const model = require('../models/server.model');
const functions = require('../functions/server.function');
const { json } = require('express');
const { ObjectId } = require('mongodb');

//const { urlencoded } = require("express");

//const _ = require("lodash");
module.exports.getdetailmember = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    const payload = JSON.parse(req.headers.payload)
    console.log(payload)
    //console.log(JSON.parse(req.headers.payload))Mappingdata
    try {
            //console.log(req.body.username)
            if (payload.username !== null && payload.username !== '') {
                // let CONF = await model.findConF(req.body).catch(() => {throw err});
                 console.log("start")
                
                 let ResultMEMBER = []
                
                if (payload.request === "member"){
                  ResultMEMBER = await model.getdetailmember(payload.user_id,payload.agent_id).catch(() => { throw err });
                   }else{
                  ResultMEMBER = await model.getdetailmember(req.body.user_id,req.body.agent_id).catch(() => { throw err });
                   }
                console.log(ResultMEMBER)
                    if (ResultMEMBER && ResultMEMBER.length) {
                        //console.log('Result',ResultMEMBER)
                        console.log(ResultMEMBER[0].username)
                        //const log = await functions.logs(ResultMEMBER[0]._id).catch(() => {throw err});
                        const ProfilePD = await functions.ProfilePD(ResultMEMBER[0].username).catch(() => {throw err});
                        console.log("PD",ProfilePD)
                        if(ProfilePD.result.result.code === 0){
                            console.log(JSON.stringify(ProfilePD.result.result.data))
                            //let resultpd = json(ProfilePD.result.result.data)
                            let responses = await functions.Mappingdata(ResultMEMBER[0],ProfilePD.result.result.data).catch(() => {throw err});
                            //console.log(T)
                            res.send({
                                status: "200",
                                message: "success",
                                username: ProfilePD.name,
                                result: responses
                            }).end();
                        }else{
                            console.log(err)
                            res.send({ status: "201", message: 'not found data'  }).end();
                        }
                       
                    } else {
                        res.send({ status: "201", message: 'not found data' }).end();
                    }
                
            } else {
                res.send({ status: "203", message: 'invalid parameter' }).end();
            }
    } catch (error) {
        console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}



//console.log(req.params.user)
  //  res.send({
    //    status: "200",
     //   param: req.params.user,
      //  message: "success",
    //}).end();