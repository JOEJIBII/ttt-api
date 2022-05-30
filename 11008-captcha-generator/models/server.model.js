const { ObjectId } = require('mongodb');
const { MongoDB} = require('../configs/connection_mongodb');

module.exports.insert = (image, value) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB
            .collection("member_register_captcha")
            .insertOne({ image, value })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.get = _id => {
    return new Promise(async (resolve, reject) => {
        await MongoDB
            .collection("member_register_captcha")
            .findOne({ $and: [{ _id: ObjectId(_id) }] })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.remove = _id => {
    return new Promise(async (resolve, reject) => {
        await MongoDB
            .collection("member_register_captcha")
            .deleteOne({ $and: [{ _id: ObjectId(_id) }] })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}