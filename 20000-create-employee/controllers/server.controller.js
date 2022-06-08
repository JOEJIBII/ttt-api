//const { ObjectID } = require('bson');
const { ObjectId, Logger } = require('mongodb');
const model = require('../models/server.model');
const functions = require('../functions/server.function');


module.exports.addemp = async function (req,res) {
    res.setHeader('Content-type', 'application/json');
    let body = req.body
    console.log(body)
    try{
        req.headers["x-real-ip"]
                   let Result = await model.addemployee(body).catch(() => {throw err});
                   if(Result.insertedId !== null && Result.insertedId !== '') {
                        //console.log(acct_pd)
                        const log = await functions.logs(body,Result.insertedId,req.headers.host).catch(() => {throw err});
                         //console.log("regis",regis
                         res.send({
                            status: "200",
                            message: "success",
                            Result 
                        }).end(); 
                   }else{
                       res.send({ status: "201", message: "Cannot Add Employee" }).end();
                   }
        }catch (error){
            //console.log(error);
            res.send({ status: "400", message: error}).end();
        }

}

