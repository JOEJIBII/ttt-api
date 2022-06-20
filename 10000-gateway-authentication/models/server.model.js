const { MongoDB } = require("../configs/connection_mongodb");
const { ObjectId } = require("mongodb");
const fetch = require('node-fetch');

module.exports.getmemb = (memb_id, agent_id, token) => {
    return new Promise(async (resolve, reject) => {
        token = "Bearer " + token;
        await MongoDB
            .collection("memb_session")
            .aggregate([{
                $match: { $and: [{ memb_id: ObjectId(memb_id) }, { agent_id: ObjectId(agent_id) }, { $or: [{ token: token }] }] }
            }, {
                $project: { _id: "$_id", sKey: "$skey" }
            }])
            .toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}


module.exports.getpanel = (emp_id, token) => {
    return new Promise(async (resolve, reject) => {
        token = "Bearer " + token;
        await MongoDB
            .collection("emp_session")
            .aggregate([{
                $match: { $and: [{ employee_id: ObjectId(emp_id) }, { $or: [{ token: token }] }] }
            }, {
                $project: { _id: "$_id", sKey: "$skey" }
            }])
            .toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}