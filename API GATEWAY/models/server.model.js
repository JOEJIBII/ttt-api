const { MongoDB } = require("../configs/connection_mongodb");
const { ObjectId } = require("mongodb");

module.exports.get = (ou, branch, token) => {
    return new Promise(async (resolve, reject) => {
        token = "Bearer " + token;
        await MongoDB
            .collection("token")
            .aggregate([{
                $match: { $and: [{ ou_id: ObjectId(ou) }, { branch_id: ObjectId(branch) }, { $or: [{ old_token: token }, { new_token: token }] }] }
            }, {
                $project: { _id: "$_id", sKey: "$secret_key" }
            }])
            .toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}