const { MongoDB } = require("../build/mongodb");

module.exports.getPushBulletData = () => {
    return new Promise(async (resolve, reject) => {
        await MongoDB
            .collection("msg_pushbullet_setting")
            .aggregate([{
                $match: { $and: [{ status: "000" }] }
            }, {
                $project: { _id: "$_id", agent: "$agent_id", name: "$name", identity: "$identity", token: "$token" }
            }])
            .toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.updateStatus = (_id, status) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB
            .collection("msg_pushbullet_setting")
            .updateOne({ _id }, { $set: { status, upd_by: "IO", upd_date: new Date(), upd_prod: "IO" } })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.insertMsg = data => {
    return new Promise(async (resolve, reject) => {
        await MongoDB
            .collection("msg_pushbullet")
            .insertOne(data)
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}