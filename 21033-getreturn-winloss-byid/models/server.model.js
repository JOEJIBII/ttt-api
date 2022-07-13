const { MongoDB } = require('../configs/connection_mongodb');
const dayjs = require('dayjs');
const { ObjectId } = require('mongodb');
const today = dayjs();
const moment = require('moment');
//const collectionmember = "member"
const collectionCONFIGURATION = "configuration"
const collectionhistory_log_api = "history_log_api"
module.exports.getreturnwinloss_summary = (file_id) => {
    // console.log(agent_id);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('winloss_transaction')
            .aggregate([
                {
                    $match: {
                        $and: [
                            {
                                _id: ObjectId(file_id)
                            },
                        ]
                    }
                },
                {
                    $unwind: { path: "$transaction_file" }
                },
                {
                    $project: {
                        _id: "$_id",
                        agent_id: "$agent_id",
                        file_name: "$file_name",
                        c_status: "$transaction_file.status",
                        c_amount: "$transaction_file.amount",
                        c_type: "$transaction_file.type",
                        transaction_file: "$transaction_file",
                        status: "$status",
                        cr_by: "$cr_by",
                        cr_date: "$cr_date",
                        upd_date: "$upd_date"
                    }
                },
                {
                    $group: {

                        _id: "$_id",
                        all: { $sum: 1 },
                        pending: { $sum: { $cond: [{ $eq: ["$c_status", "pending"] }, 1, 0] } },
                        success: { $sum: { $cond: [{ $eq: ["$c_status", "success"] }, 1, 0] } },
                        fail: { $sum: { $cond: [{ $eq: ["$c_status", "failed"] }, 1, 0] } },
                        amountCash: { $sum: { $cond: [{ $eq: ["$c_type", "cash"] }, "$c_amount", 0] } },
                        amountBonus: { $sum: { $cond: [{ $eq: ["$c_type", "bonus"] }, "$c_amount", 0] } },
                        data: { $first: { _id: "$_id", file_name: "$file_name", status: "$status", agent_id: "$agent_id", cr_by: "$cr_by", cr_date: "$cr_date", upd_date: "$upd_date" } },

                    }
                },
                {
                    $group: {
                        _id: "$data",
                        all: { $sum: "$all" },
                        pending: { $sum: "$pending" },
                        success: { $sum: "$success" },
                        fail: { $sum: "$fail" },
                        amountCash: { $sum: "$amountCash" },
                        amountBonus: { $sum: "$amountBonus" }
                    }
                },
                {
                    $project: {
                        _id: "$_id._id",
                        agent_id: "$_id.agent_id",
                        file_name: "$_id.file_name",
                        status: "$_id.status",
                        all: "$all",
                        pending: "$pending",
                        success: "$success",
                        fail: "$fail",
                        amountCash: "$amountCash",
                        amountBonus: "$amountBonus",
                        cr_by: "$_id.cr_by",
                        cr_date: "$_id.cr_date",
                        upd_date: "$_id.upd_date"
                    }
                }, {
                    $lookup: {
                        from: "agent",
                        localField: "agent_id",
                        foreignField: "_id",
                        as: "web"
                    }
                }, {
                    $unwind: { path: "$web" }
                },
                {
                    $project: {
                        _id: "$_id",
                        agent_id: "$web.name",
                        file_name: "$file_name",
                        status: "$status",
                        all: "$all",
                        pending: "$pending",
                        success: "$success",
                        fail: "$fail",
                        amountCash: "$amountCash",
                        amountBonus: "$amountBonus",
                        cr_by: "$cr_by",
                        cr_date: "$cr_date",
                        upd_date: "$upd_date"
                    }
                }, {
                    $lookup: {
                        from: "employee",
                        localField: "cr_by",
                        foreignField: "_id",
                        as: "emp"
                    }
                }, {
                    $unwind: { path: "$emp" }
                },
                {
                    $project: {
                        _id: "$_id",
                        agent_id: "$web.name",
                        file_name: "$file_name",
                        status: "$status",
                        all: "$all",
                        pending: "$pending",
                        success: "$success",
                        fail: "$fail",
                        amountCash: "$amountCash",
                        amountBonus: "$amountBonus",
                        cr_by: "$emp.username",
                        cr_date: "$cr_date",
                        upd_date: "$upd_date"
                    }
                },
            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.getreturnwinloss_transaction = (file_id) => {
    // console.log(agent_id);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('winloss_transaction')
            .aggregate([
                {
                    $match: {
                        $and: [
                            {
                                _id: ObjectId(file_id)
                            },
                        ]
                    }
                },
                {
                    $project: {
                        _id: "$_id",
                        agent_id: "$agent_id",
                        file_name: "$file_name",
                        transaction_file: "$transaction_file",
                        status: "$status"
                    }
                },

            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.getbankid = (body) => {
    // console.log(agent_id);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('bank')
            .aggregate([
                {
                    $match: {
                        $and: [
                            {
                                code: body.bank_code
                            },

                        ]
                    }
                },
                {
                    $project: {
                        _id: 1,
                    }
                }
            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}



module.exports.findConF = (body) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionCONFIGURATION)
            .aggregate([
                {
                    $match: {
                        $and: [
                            //{ou_id : ObjectId(payload.ou)},
                            //{branch_id : ObjectId(payload.branch)},
                            { domain_name: body.domain_name }
                        ]
                    }
                },

            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.getagent_id = (user_id) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('employee')
            .aggregate([

                {
                    $match: {
                        $and: [
                            { _id: ObjectId(user_id) },
                        ]
                    }
                }, {
                    $project: {
                        _id: 1,
                        agent_id: "$pool.agent_pool"
                    }
                }

            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));


    });
}