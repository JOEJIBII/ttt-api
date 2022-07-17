const { MongoDB } = require('../configs/connection_mongodb');
const moment = require('moment');
const { ObjectId } = require('mongodb');


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


module.exports.getdeposit = (agent_id) => {
        // console.log(body);
        return new Promise(async (resolve, reject) => {

                await MongoDB.collection('deposit')

                        .aggregate([
                                {
                                        $match: {
                                                $and: [{
                                                        agent_id: ObjectId(agent_id)
                                                }, {
                                                        $or: [
                                                                { status: "approve" }, { status: "cancel" }, { status: "processing" }, { status: "success" }
                                                        ]
                                                }
                                                ]

                                        }
                                }, {
                                        $project: {
                                                id: 1,
                                                channel: { $ifNull: ['$channel', null] },
                                                type: "$type",
                                                sub_type: "$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                agent_id: "$agent_id",
                                                memb_id: "$memb_id",
                                                description: "$description",
                                                from_bank_id: "$from_bank_id",
                                                from_account_id: "$from_account_id",
                                                to_bank_id: "$to_bank_id",
                                                to_account_id: "$to_account_id",
                                                approve_by: "$approve_by",
                                                approve_date: "$approve_date",
                                                check_by: "$check_by",
                                                checked_date: "$checked_date"
                                        }
                                }, {
                                        $lookup: {
                                                from: "member_provider_account",
                                                localField: "memb_id",
                                                foreignField: "memb_id",
                                                as: "memb_prov"
                                        }
                                }, {
                                        $unwind: { path: "$memb_prov", preserveNullAndEmptyArrays: true }
                                }, {
                                        $project: {
                                                id: 1,
                                                channel: "$channel",
                                                type: "$type",
                                                sub_type: "$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description: "$description",
                                                agent_id: "$agent_id",
                                                memb_id: "$memb_id",
                                                memb_username: { $ifNull: ['$memb_prov.username', null] },
                                                from_bank_id: "$from_bank_id",
                                                from_account_id: "$from_account_id",
                                                to_bank_id: "$to_bank_id",
                                                to_account_id: "$to_account_id",
                                                check_by: "$check_by",
                                                checked_date: "$checked_date",
                                                approve_by: "$approve_by",
                                                approve_date: "$approve_date",
                                        }
                                }, {
                                        $lookup: {
                                                from: "memb_bank_account",
                                                localField: "memb_id",
                                                foreignField: "memb_id",
                                                as: "memb_bank"
                                        }
                                }, {
                                        $unwind: { path: "$memb_bank", preserveNullAndEmptyArrays: true }
                                },
                                {
                                        $project: {
                                                id: 1,
                                                channel: "$channel",
                                                type: "$type",
                                                sub_type: "$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description: "$description",
                                                agent_id: "$agent_id",
                                                memb_id: "$memb_id",
                                                memb_username: "$memb_username",
                                                memb_name: { $ifNull: ['$memb_bank.account_name', null] },
                                                memb_bank: { $ifNull: ['$memb_bank.account_number', null] },
                                                from_bank_id: "$from_bank_id",
                                                from_account_id: "$from_account_id",
                                                to_bank_id: "$to_bank_id",
                                                to_account_id: "$to_account_id",
                                                approve_by: "$approve_by",
                                                approve_date: "$approve_date",
                                                check_by: "$check_by",
                                                checked_date: "$checked_date"
                                        }
                                }, {
                                        $lookup: {
                                                from: "bank",
                                                localField: "from_bank_id",
                                                foreignField: "_id",
                                                as: "banking_memb"
                                        }
                                },
                                {
                                        $unwind: { path: "$banking_memb", preserveNullAndEmptyArrays: true }
                                },
                                {
                                        $project: {
                                                id: 1,
                                                channel: "$channel",
                                                type: "$type",
                                                sub_type: "$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description: "$description",
                                                agent_id: "$agent_id",
                                                memb_id: "$memb_id",
                                                memb_username: "$memb_username",
                                                memb_name: "$memb_name",
                                                memb_bank: "$memb_bank",
                                                memb_banking_th: { $ifNull: ['$banking_memb.nameth', null] },
                                                memb_banking_en: { $ifNull: ['$banking_memb.nameen', null] },
                                                memb_banking_code: { $ifNull: ['$banking_memb.code', null] },
                                                from_bank_id: "$from_bank_id",
                                                from_account_id: "$from_account_id",
                                                to_bank_id: "$to_bank_id",
                                                to_account_id: "$to_account_id",
                                                approve_by: "$approve_by",
                                                approve_date: "$approve_date",
                                                check_by: "$check_by",
                                                checked_date: "$checked_date"
                                        }
                                },
                                {
                                        $lookup: {
                                                from: "bank",
                                                localField: "to_bank_id",
                                                foreignField: "_id",
                                                as: "banking_agent"
                                        }
                                },
                                {
                                        $unwind: { path: "$banking_agent", preserveNullAndEmptyArrays: true }
                                },
                                {
                                        $project: {
                                                id: 1,
                                                channel: "$channel",
                                                type: "$type",
                                                sub_type: "$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description: "$description",
                                                agent_id: "$agent_id",
                                                memb_id: "$memb_id",
                                                memb_username: "$memb_username",
                                                memb_name: "$memb_name",
                                                memb_bank: "$memb_bank",
                                                memb_banking_th: "$memb_banking_th",
                                                memb_banking_en: "$memb_banking_en",
                                                memb_banking_code: "$memb_banking_code",
                                                from_bank_id: "$from_bank_id",
                                                from_account_id: "$from_account_id",
                                                web_account_nameth: { $ifNull: ['$banking_agent.nameth', null] },
                                                web_account_nameen: { $ifNull: ['$banking_agent.nameen', null] },
                                                web_account_code: { $ifNull: ['$banking_agent.code', null] },
                                                to_bank_id: "$to_bank_id",
                                                to_account_id: "$to_account_id",
                                                approve_by: "$approve_by",
                                                approve_date: "$approve_date",
                                                check_by: "$check_by",
                                                checked_date: "$checked_date"
                                        }
                                },
                                {
                                        $lookup: {
                                                from: "agent_bank_account",
                                                localField: "to_account_id",
                                                foreignField: "_id",
                                                as: "agent_account"
                                        }
                                },
                                {
                                        $unwind: { path: "$agent_account", preserveNullAndEmptyArrays: true }
                                },
                                {
                                        $project: {
                                                id: 1,
                                                channel: "$channel",
                                                type: "$type",
                                                sub_type: "$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description: "$description",
                                                agent_id: "$agent_id",
                                                memb_id: "$memb_id",
                                                memb_username: "$memb_username",
                                                memb_name: "$memb_name",
                                                memb_bank: "$memb_bank",
                                                memb_banking_th: "$memb_banking_th",
                                                memb_banking_en: "$memb_banking_en",
                                                memb_banking_code: "$memb_banking_code",
                                                from_bank_id: "$from_bank_id",
                                                from_account_id: "$from_account_id",
                                                web_account_nameth: "$web_account_nameth",
                                                web_account_nameen: "$web_account_nameen",
                                                web_account_code: "$web_account_code",
                                                web_account_name: { $ifNull: ['$agent_account.account_name', null] },
                                                web_account_number: { $ifNull: ['$agent_account.account_number', null] },
                                                to_bank_id: "$to_bank_id",
                                                to_account_id: "$to_account_id",
                                                approve_by: "$approve_by",
                                                approve_date: "$approve_date",
                                                check_by: "$check_by",
                                                checked_date: "$checked_date"
                                        }
                                },
                                {
                                        $lookup: {
                                                from: "agent",
                                                localField: "agent_id",
                                                foreignField: "_id",
                                                as: "webagent"
                                        }
                                },
                                {
                                        $unwind: { path: "$webagent", preserveNullAndEmptyArrays: true }
                                },
                                {
                                        $project: {
                                                id: 1,
                                                channel: "$channel",
                                                type: "$type",
                                                sub_type: "$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description: "$description",
                                                agent_id: "$agent_id",
                                                web_name: { $ifNull: ['$webagent.domain_name', null] },
                                                web_aka: { $ifNull: ['$webagent.name', null] },
                                                web_prefix: { $ifNull: ['$webagent.prefix', null] },
                                                memb_id: "$memb_id",
                                                memb_username: "$memb_username",
                                                memb_name: "$memb_name",
                                                memb_bank: "$memb_bank",
                                                memb_banking_th: "$memb_banking_th",
                                                memb_banking_en: "$memb_banking_en",
                                                memb_banking_code: "$memb_banking_code",
                                                from_bank_id: "$from_bank_id",
                                                from_account_id: "$from_account_id",
                                                web_account_nameth: "$web_account_nameth",
                                                web_account_nameen: "$web_account_nameen",
                                                web_account_code: "$web_account_code",
                                                web_account_name: "$web_account_name",
                                                web_account_number: "$web_account_number",
                                                to_bank_id: "$to_bank_id",
                                                to_account_id: "$to_account_id",
                                                approve_by: "$approve_by",
                                                approve_date: "$approve_date",
                                                check_by: "$check_by",
                                                checked_date: "$checked_date"
                                        }
                                },
                                {
                                        $lookup: {
                                                from: "member",
                                                localField: "memb_id",
                                                foreignField: "_id",
                                                as: "memb_acc"
                                        }
                                },
                                {
                                        $unwind: { path: "$memb_acc", preserveNullAndEmptyArrays: true }
                                },
                                {
                                        $project: {
                                                id: 1,
                                                channel: "$channel",
                                                type: "$type",
                                                sub_type: "$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description: "$description",
                                                agent_id: "$agent_id",
                                                web_name: "$web_name",
                                                web_aka: "$web_aka",
                                                web_prefix: "$web_prefix",
                                                memb_id: "$memb_id",
                                                memb_username: "$memb_username",
                                                memb_status: { $ifNull: ['$memb_acc.status', null] },
                                                memb_name: "$memb_name",
                                                memb_bank: "$memb_bank",
                                                memb_banking_th: "$memb_banking_th",
                                                memb_banking_en: "$memb_banking_en",
                                                memb_banking_code: "$memb_banking_code",
                                                from_bank_id: "$from_bank_id",
                                                from_account_id: "$from_account_id",
                                                web_account_nameth: "$web_account_nameth",
                                                web_account_nameen: "$web_account_nameen",
                                                web_account_code: "$web_account_code",
                                                web_account_name: "$web_account_name",
                                                web_account_number: "$web_account_number",
                                                to_bank_id: "$to_bank_id",
                                                to_account_id: "$to_account_id",
                                                approve_by: "$approve_by",
                                                approve_date: "$approve_date",
                                                check_by: "$check_by",
                                                checked_date: "$checked_date"
                                        }
                                },
                                {
                                        $lookup: {
                                                from: "employee",
                                                localField: "check_by",
                                                foreignField: "_id",
                                                as: "emp"
                                        }
                                },
                                {
                                        $unwind: { path: "$emp", preserveNullAndEmptyArrays: true }
                                },
                                {
                                        $project: {
                                                id: 1,
                                                channel: "$channel",
                                                type: "$type",
                                                sub_type: "$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description: "$description",
                                                agent_id: "$agent_id",
                                                web_name: "$web_name",
                                                web_aka: "$web_aka",
                                                web_prefix: "$web_prefix",
                                                memb_id: "$memb_id",
                                                memb_username: "$memb_username",
                                                memb_status: "$memb_status",
                                                memb_name: "$memb_name",
                                                memb_bank: "$memb_bank",
                                                memb_banking_th: "$memb_banking_th",
                                                memb_banking_en: "$memb_banking_en",
                                                memb_banking_code: "$memb_banking_code",
                                                from_bank_id: "$from_bank_id",
                                                from_account_id: "$from_account_id",
                                                web_account_nameth: "$web_account_nameth",
                                                web_account_nameen: "$web_account_nameen",
                                                web_account_code: "$web_account_code",
                                                web_account_name: "$web_account_name",
                                                web_account_number: "$web_account_number",
                                                to_bank_id: "$to_bank_id",
                                                to_account_id: "$to_account_id",
                                                approve_by: "$approve_by",
                                                approve_date: "$approve_date",
                                                checked: {
                                                        $cond: [{
                                                                $eq: [{ $ifNull: ["$emp.username", null] }, null]
                                                        },
                                                                null,
                                                        {
                                                                check_by: "$check_by",
                                                                checked_date: "$checked_date",
                                                                checker_username: "$emp.username",
                                                                checker_name: "$emp.name",
                                                                checker_tel: "$emp.tel",
                                                                checker_role: "$emp.role",
                                                                checker_avatar: "$emp.avatar",
                                                        }]
                                                }
                                        }
                                },
                                {
                                        $lookup: {
                                                from: "emp_role",
                                                localField: "checked.checker_role",
                                                foreignField: "_id",
                                                as: "role"
                                        }
                                }, {
                                        $unwind: { path: "$role", preserveNullAndEmptyArrays: true }
                                }, {
                                        $project: {
                                                id: 1,
                                                channel: "$channel",
                                                type: "$type",
                                                sub_type: "$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description: "$description",
                                                agent_id: "$agent_id",
                                                web_name: "$web_name",
                                                web_aka: "$web_aka",
                                                web_prefix: "$web_prefix",
                                                memb_id: "$memb_id",
                                                memb_username: "$memb_username",
                                                memb_status: "$memb_status",
                                                memb_name: "$memb_name",
                                                memb_bank: "$memb_bank",
                                                memb_banking_th: "$memb_banking_th",
                                                memb_banking_en: "$memb_banking_en",
                                                memb_banking_code: "$memb_banking_code",
                                                from_bank_id: "$from_bank_id",
                                                from_account_id: "$from_account_id",
                                                web_account_nameth: "$web_account_nameth",
                                                web_account_nameen: "$web_account_nameen",
                                                web_account_code: "$web_account_code",
                                                web_account_name: "$web_account_name",
                                                web_account_number: "$web_account_number",
                                                to_bank_id: "$to_bank_id",
                                                to_account_id: "$to_account_id",
                                                approve_by: "$approve_by",
                                                approve_date: "$approve_date",
                                                checked: {
                                                        $cond: [{
                                                                $eq: [{ $ifNull: ["$checked", null] }, null]
                                                        },
                                                                null,
                                                        {
                                                                check_by: "$checked.check_by",
                                                                checked_date: "$checked.checked_date",
                                                                checker_username: "$checked.checker_username",
                                                                checker_name: "$checked.checker_name",
                                                                checker_tel: "$checked.checker_tel",
                                                                checker_role: "$role.name",
                                                                checker_avatar: "$checked.checker_avatar",
                                                        }]
                                                }
                                        }
                                },
                                {
                                        $lookup: {
                                                from: "employee",
                                                localField: "approve_by",
                                                foreignField: "_id",
                                                as: "emp"
                                        }
                                }, {
                                        $unwind: { path: "$emp", preserveNullAndEmptyArrays: true }
                                },
                                {
                                        $project: {
                                                id: 1,
                                                channel: "$channel",
                                                type: "$type",
                                                sub_type: "$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description: "$description",
                                                agent_id: "$agent_id",
                                                web_name: "$web_name",
                                                web_aka: "$web_aka",
                                                web_prefix: "$web_prefix",
                                                memb_id: "$memb_id",
                                                memb_username: "$memb_username",
                                                memb_status: "$memb_status",
                                                memb_name: "$memb_name",
                                                memb_bank: "$memb_bank",
                                                memb_banking_th: "$memb_banking_th",
                                                memb_banking_en: "$memb_banking_en",
                                                memb_banking_code: "$memb_banking_code",
                                                from_bank_id: "$from_bank_id",
                                                from_account_id: "$from_account_id",
                                                web_account_nameth: "$web_account_nameth",
                                                web_account_nameen: "$web_account_nameen",
                                                web_account_code: "$web_account_code",
                                                web_account_name: "$web_account_name",
                                                web_account_number: "$web_account_number",
                                                to_bank_id: "$to_bank_id",
                                                to_account_id: "$to_account_id",
                                                checked: "$checked",
                                                approve_by: {
                                                        $cond: [{
                                                                $eq: [{ $ifNull: ["$emp.username", null] }, null]
                                                        },
                                                                null,
                                                        {
                                                                approve_by: "$approve_by",
                                                                approve_date: "$approve_date",
                                                                approve_username: "$emp.username",
                                                                approve_name: "$emp.name",
                                                                approve_tel: "$emp.tel",
                                                                approve_role: "$emp.role",
                                                                approve_avatar: "$emp.avatar",
                                                        }]
                                                }
                                        }
                                }, {
                                        $lookup: {
                                                from: "emp_role",
                                                localField: "approve_by.approve_role",
                                                foreignField: "_id",
                                                as: "role"
                                        }
                                }, {
                                        $unwind: { path: "$role", preserveNullAndEmptyArrays: true }
                                },

                                {
                                        $project: {
                                                id: 1,
                                                channel: "$channel",
                                                type: "$type",
                                                sub_type: "$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description: "$description",
                                                agent_id: "$agent_id",
                                                web_name: "$web_name",
                                                web_aka: "$web_aka",
                                                web_prefix: "$web_prefix",
                                                memb_id: "$memb_id",
                                                memb_username: "$memb_username",
                                                memb_status: "$memb_status",
                                                memb_name: "$memb_name",
                                                memb_bank: "$memb_bank",
                                                memb_banking_th: "$memb_banking_th",
                                                memb_banking_en: "$memb_banking_en",
                                                memb_banking_code: "$memb_banking_code",
                                                from_bank_id: "$from_bank_id",
                                                from_account_id: "$from_account_id",
                                                web_account_nameth: "$web_account_nameth",
                                                web_account_nameen: "$web_account_nameen",
                                                web_account_code: "$web_account_code",
                                                web_account_name: "$web_account_name",
                                                web_account_number: "$web_account_number",
                                                to_bank_id: "$to_bank_id",
                                                to_account_id: "$to_account_id",
                                                checked: "$checked",
                                                approve_by:
                                                {
                                                        approve_by: "$approve_by.approve_by",
                                                        approve_date: "$approve_by.approve_date",
                                                        approve_username: "$approve_by.approve_username",
                                                        approve_name: "$approve_by.approve_name",
                                                        approve_tel: "$approve_by.approve_tel",
                                                        approve_role: "$role.name",
                                                        approve_avatar: "$approve_by.approve_avatar",
                                                }
                                        }
                                },

                        ]).toArray()
                        .then(result => resolve(result))
                        .catch(error => reject(error));
        });
}

module.exports.getwithdraw = (agent_id) => {
        // console.log(body);
        return new Promise(async (resolve, reject) => {

                await MongoDB.collection('withdraw')

                        .aggregate([
                                {
                                        $match: {
                                                $and: [{
                                                        agent_id: ObjectId(agent_id)
                                                }, {
                                                        $or: [
                                                                { status: "approve" }, { status: "cancel" }, { status: "processing" }, { status: "success" }
                                                        ]
                                                }
                                                ]

                                        }
                                },  {
                                        $project: {
                                            id: 1,
                                            channel: { $ifNull: ['$channel', null] },
                                            type: "$type",
                                            sub_type: "$sub_type",
                                            amount: "$amount",
                                            request_date: "$request_date",
                                            status: "$status",
                                            description: "$description",
                                            agent_id: "$agent_id",
                                            memb_id: "$memb_id",
                                            from_bank_id: "$from_bank_id",
                                            from_account_id: "$from_account_id",
                                            to_bank_id: "$to_bank_id",
                                            to_account_id: "$to_account_id",
                                            approve_by: "$approve_by",
                                            approve_date: "$approve_date",
                                            check_by: "$check_by",
                                            checked_date: "$checked_date"
                                        }
                                    }, {
                                        $lookup: {
                                            from: "member_provider_account",
                                            localField: "memb_id",
                                            foreignField: "memb_id",
                                            as: "memb_prov"
                                        }
                                    }, {
                                        $unwind: { path: "$memb_prov", preserveNullAndEmptyArrays: true }
                                    },
                                    {
                                        $project: {
                                            id: 1,
                                            channel: "$channel",
                                            type: "$type",
                                            sub_type: "$sub_type",
                                            amount: "$amount",
                                            request_date: "$request_date",
                                            status: "$status",
                                            description: "$description",
                                            agent_id: "$agent_id",
                                            memb_id: "$memb_id",
                                            memb_username: { $ifNull: ['$memb_prov.username', null] },
                                            from_bank_id: "$from_bank_id",
                                            from_account_id: "$from_account_id",
                                            to_bank_id: "$to_bank_id",
                                            to_account_id: "$to_account_id",
                                            approve_by: "$approve_by",
                                            approve_date: "$approve_date",
                                            check_by: "$check_by",
                                            checked_date: "$checked_date"
                                        }
                                    }, {
                                        $lookup: {
                                            from: "memb_bank_account",
                                            localField: "memb_id",
                                            foreignField: "memb_id",
                                            as: "memb_bank"
                                        }
                                    }, {
                                        $unwind: { path: "$memb_bank", preserveNullAndEmptyArrays: true }
                                    },
                                    {
                                        $project: {
                                            id: 1,
                                            channel: "$channel",
                                            type: "$type",
                                            sub_type: "$sub_type",
                                            amount: "$amount",
                                            request_date: "$request_date",
                                            status: "$status",
                                            description: "$description",
                                            agent_id: "$agent_id",
                                            memb_id: "$memb_id",
                                            memb_username: "$memb_username",
                                            memb_name: { $ifNull: ['$memb_bank.account_name', null] },
                                            memb_bank: { $ifNull: ['$memb_bank.account_number', null] },
                                            from_bank_id: "$from_bank_id",
                                            from_account_id: "$from_account_id",
                                            to_bank_id: "$to_bank_id",
                                            to_account_id: "$to_account_id",
                                            approve_by: "$approve_by",
                                            approve_date: "$approve_date",
                                            check_by: "$check_by",
                                            checked_date: "$checked_date"
                                        }
                                    }, {
                                        $lookup: {
                                            from: "bank",
                                            localField: "to_bank_id",
                                            foreignField: "_id",
                                            as: "banking_memb"
                                        }
                                    },
                                    {
                                        $unwind: { path: "$banking_memb", preserveNullAndEmptyArrays: true }
                                    },
                                    {
                                        $project: {
                                            id: 1,
                                            channel: "$channel",
                                            type: "$type",
                                            sub_type: "$sub_type",
                                            amount: "$amount",
                                            request_date: "$request_date",
                                            status: "$status",
                                            description: "$description",
                                            agent_id: "$agent_id",
                                            memb_id: "$memb_id",
                                            memb_username: "$memb_username",
                                            memb_name: "$memb_name",
                                            memb_bank: "$memb_bank",
                                            memb_banking_th: { $ifNull: ['$banking_memb.nameth', null] },
                                            memb_banking_en: { $ifNull: ['$banking_memb.nameen', null] },
                                            memb_banking_code: { $ifNull: ['$banking_memb.code', null] },
                                            from_bank_id: "$from_bank_id",
                                            from_account_id: "$from_account_id",
                                            to_bank_id: "$to_bank_id",
                                            to_account_id: "$to_account_id",
                                            approve_by: "$approve_by",
                                            approve_date: "$approve_date",
                                            check_by: "$check_by",
                                            checked_date: "$checked_date"
                                        }
                                    }, {
                                        $lookup: {
                                            from: "bank",
                                            localField: "from_bank_id",
                                            foreignField: "_id",
                                            as: "banking_agent"
                                        }
                                    },
                                    {
                                        $unwind: { path: "$banking_agent", preserveNullAndEmptyArrays: true }
                                    },
                                    {
                                        $project: {
                                            id: 1,
                                            channel: "$channel",
                                            type: "$type",
                                            sub_type: "$sub_type",
                                            amount: "$amount",
                                            request_date: "$request_date",
                                            status: "$status",
                                            description: "$description",
                                            agent_id: "$agent_id",
                                            memb_id: "$memb_id",
                                            memb_username: "$memb_username",
                                            memb_name: "$memb_name",
                                            memb_bank: "$memb_bank",
                                            memb_banking_th: "$memb_banking_th",
                                            memb_banking_en: "$memb_banking_en",
                                            memb_banking_code: "$memb_banking_code",
                                            from_bank_id: "$from_bank_id",
                                            from_account_id: "$from_account_id",
                                            web_account_nameth: { $ifNull: ['$banking_agent.nameth', null] },
                                            web_account_nameen: { $ifNull: ['$banking_agent.nameen', null] },
                                            web_account_code: { $ifNull: ['$banking_agent.code', null] },
                                            to_bank_id: "$to_bank_id",
                                            to_account_id: "$to_account_id",
                                            approve_by: "$approve_by",
                                            approve_date: "$approve_date",
                                            check_by: "$check_by",
                                            checked_date: "$checked_date"
                                        }
                                    },
                                    {
                                        $lookup: {
                                            from: "agent_bank_account",
                                            localField: "from_account_id",
                                            foreignField: "_id",
                                            as: "agent_account"
                                        }
                                    },
                                    {
                                        $unwind: { path: "$agent_account", preserveNullAndEmptyArrays: true }
                                    },
                                    {
                                        $project: {
                                            id: 1,
                                            channel: "$channel",
                                            type: "$type",
                                            sub_type: "$sub_type",
                                            amount: "$amount",
                                            request_date: "$request_date",
                                            status: "$status",
                                            description: "$description",
                                            agent_id: "$agent_id",
                                            memb_id: "$memb_id",
                                            memb_username: "$memb_username",
                                            memb_name: "$memb_name",
                                            memb_bank: "$memb_bank",
                                            memb_banking_th: "$memb_banking_th",
                                            memb_banking_en: "$memb_banking_en",
                                            memb_banking_code: "$memb_banking_code",
                                            from_bank_id: "$from_bank_id",
                                            from_account_id: "$from_account_id",
                                            web_account_nameth: "$web_account_nameth",
                                            web_account_nameen: "$web_account_nameen",
                                            web_account_code: "$web_account_code",
                                            web_account_name: { $ifNull: ['$agent_account.account_name', null] },
                                            web_account_number: { $ifNull: ['$agent_account.account_number', null] },
                                            to_bank_id: "$to_bank_id",
                                            to_account_id: "$to_account_id",
                                            approve_by: "$approve_by",
                                            approve_date: "$approve_date",
                                            check_by: "$check_by",
                                            checked_date: "$checked_date"
                                        }
                                    },
                                    {
                                        $lookup: {
                                            from: "agent",
                                            localField: "agent_id",
                                            foreignField: "_id",
                                            as: "webagent"
                                        }
                                    },
                                    {
                                        $unwind: { path: "$webagent", preserveNullAndEmptyArrays: true }
                                    },
                                    {
                                        $project: {
                                            id: 1,
                                            channel: "$channel",
                                            type: "$type",
                                            sub_type: "$sub_type",
                                            amount: "$amount",
                                            request_date: "$request_date",
                                            status: "$status",
                                            description: "$description",
                                            agent_id: "$agent_id",
                                            web_name: { $ifNull: ['$webagent.domain_name', null] },
                                            web_aka: { $ifNull: ['$webagent.name', null] },
                                            web_prefix: { $ifNull: ['$webagent.prefix', null] },
                                            memb_id: "$memb_id",
                                            memb_username: "$memb_username",
                                            memb_name: "$memb_name",
                                            memb_bank: "$memb_bank",
                                            memb_banking_th: "$memb_banking_th",
                                            memb_banking_en: "$memb_banking_en",
                                            memb_banking_code: "$memb_banking_code",
                                            from_bank_id: "$from_bank_id",
                                            from_account_id: "$from_account_id",
                                            web_account_nameth: "$web_account_nameth",
                                            web_account_nameen: "$web_account_nameen",
                                            web_account_code: "$web_account_code",
                                            web_account_name: "$web_account_name",
                                            web_account_number: "$web_account_number",
                                            to_bank_id: "$to_bank_id",
                                            to_account_id: "$to_account_id",
                                            approve_by: "$approve_by",
                                            approve_date: "$approve_date",
                                            check_by: "$check_by",
                                            checked_date: "$checked_date"
                                        }
                                    },
                                    {
                                        $lookup: {
                                            from: "member",
                                            localField: "memb_id",
                                            foreignField: "_id",
                                            as: "memb_acc"
                                        }
                                    },
                                    {
                                        $unwind: { path: "$memb_acc", preserveNullAndEmptyArrays: true }
                                    },
                                    {
                                        $project: {
                                            id: 1,
                                            channel: "$channel",
                                            type: "$type",
                                            sub_type: "$sub_type",
                                            amount: "$amount",
                                            request_date: "$request_date",
                                            status: "$status",
                                            description: "$description",
                                            agent_id: "$agent_id",
                                            web_name: "$web_name",
                                            web_aka: "$web_aka",
                                            web_prefix: "$web_prefix",
                                            memb_id: "$memb_id",
                                            memb_username: "$memb_username",
                                            memb_status: { $ifNull: ['$memb_acc.status', null] },
                                            memb_name: "$memb_name",
                                            memb_bank: "$memb_bank",
                                            memb_banking_th: "$memb_banking_th",
                                            memb_banking_en: "$memb_banking_en",
                                            memb_banking_code: "$memb_banking_code",
                                            from_bank_id: "$from_bank_id",
                                            from_account_id: "$from_account_id",
                                            web_account_nameth: "$web_account_nameth",
                                            web_account_nameen: "$web_account_nameen",
                                            web_account_code: "$web_account_code",
                                            web_account_name: "$web_account_name",
                                            web_account_number: "$web_account_number",
                                            to_bank_id: "$to_bank_id",
                                            to_account_id: "$to_account_id",
                                            approve_by: "$approve_by",
                                            approve_date: "$approve_date",
                                            check_by: "$check_by",
                                            checked_date: "$checked_date"
                                        }
                                    },
                                    {
                                        $lookup: {
                                            from: "employee",
                                            localField: "check_by",
                                            foreignField: "_id",
                                            as: "emp"
                                        }
                                    },
                                    {
                                        $unwind: { path: "$emp", preserveNullAndEmptyArrays: true }
                                    },
                                    {
                                        $project: {
                                            id: 1,
                                            channel: "$channel",
                                            type: "$type",
                                            sub_type: "$sub_type",
                                            amount: "$amount",
                                            request_date: "$request_date",
                                            status: "$status",
                                            description: "$description",
                                            agent_id: "$agent_id",
                                            web_name: "$web_name",
                                            web_aka: "$web_aka",
                                            web_prefix: "$web_prefix",
                                            memb_id: "$memb_id",
                                            memb_username: "$memb_username",
                                            memb_status: "$memb_status",
                                            memb_name: "$memb_name",
                                            memb_bank: "$memb_bank",
                                            memb_banking_th: "$memb_banking_th",
                                            memb_banking_en: "$memb_banking_en",
                                            memb_banking_code: "$memb_banking_code",
                                            from_bank_id: "$from_bank_id",
                                            from_account_id: "$from_account_id",
                                            web_account_nameth: "$web_account_nameth",
                                            web_account_nameen: "$web_account_nameen",
                                            web_account_code: "$web_account_code",
                                            web_account_name: "$web_account_name",
                                            web_account_number: "$web_account_number",
                                            to_bank_id: "$to_bank_id",
                                            to_account_id: "$to_account_id",
                                            approve_by: "$approve_by",
                                            approve_date: "$approve_date",
                                            checked: {
                                                $cond: [{
                                                    $eq: [{ $ifNull: ["$emp.username", null] }, null]
                                                },
                                                    null,
                                                {
                                                    check_by: "$check_by",
                                                    checked_date: "$checked_date",
                                                    checker_username: "$emp.username",
                                                    checker_name: "$emp.name",
                                                    checker_tel: "$emp.tel",
                                                    checker_role: "$emp.role",
                                                    checker_avatar: "$emp.avatar",
                                                }]
                                            }
                                        }
                                    },
                                    {
                                        $lookup: {
                                            from: "emp_role",
                                            localField: "checked.checker_role",
                                            foreignField: "_id",
                                            as: "role"
                                        }
                                    }, {
                                        $unwind: { path: "$role", preserveNullAndEmptyArrays: true }
                                    }, {
                                        $project: {
                                            id: 1,
                                            channel: "$channel",
                                            type: "$type",
                                            sub_type: "$sub_type",
                                            amount: "$amount",
                                            request_date: "$request_date",
                                            status: "$status",
                                            description: "$description",
                                            agent_id: "$agent_id",
                                            web_name: "$web_name",
                                            web_aka: "$web_aka",
                                            web_prefix: "$web_prefix",
                                            memb_id: "$memb_id",
                                            memb_username: "$memb_username",
                                            memb_status: "$memb_status",
                                            memb_name: "$memb_name",
                                            memb_bank: "$memb_bank",
                                            memb_banking_th: "$memb_banking_th",
                                            memb_banking_en: "$memb_banking_en",
                                            memb_banking_code: "$memb_banking_code",
                                            from_bank_id: "$from_bank_id",
                                            from_account_id: "$from_account_id",
                                            web_account_nameth: "$web_account_nameth",
                                            web_account_nameen: "$web_account_nameen",
                                            web_account_code: "$web_account_code",
                                            web_account_name: "$web_account_name",
                                            web_account_number: "$web_account_number",
                                            to_bank_id: "$to_bank_id",
                                            to_account_id: "$to_account_id",
                                            approve_by: "$approve_by",
                                            approve_date: "$approve_date",
                                            checked: {
                                                $cond: [{
                                                    $eq: [{ $ifNull: ["$checked", null] }, null]
                                                },
                                                    null,
                                                {
                                                    check_by: "$checked.check_by",
                                                    checked_date: "$checked.checked_date",
                                                    checker_username: "$checked.checker_username",
                                                    checker_name: "$checked.checker_name",
                                                    checker_tel: "$checked.checker_tel",
                                                    checker_role: "$role.name",
                                                    checker_avatar: "$checked.checker_avatar",
                                                }]
                                            }
                                        }
                                    },
                                    {
                                        $lookup: {
                                            from: "employee",
                                            localField: "approve_by",
                                            foreignField: "_id",
                                            as: "emp"
                                        }
                                    }, {
                                        $unwind: { path: "$emp", preserveNullAndEmptyArrays: true }
                                    },
                                    {
                                        $project: {
                                            id: 1,
                                            channel: "$channel",
                                            type: "$type",
                                            sub_type: "$sub_type",
                                            amount: "$amount",
                                            request_date: "$request_date",
                                            status: "$status",
                                            description: "$description",
                                            agent_id: "$agent_id",
                                            web_name: "$web_name",
                                            web_aka: "$web_aka",
                                            web_prefix: "$web_prefix",
                                            memb_id: "$memb_id",
                                            memb_username: "$memb_username",
                                            memb_status: "$memb_status",
                                            memb_name: "$memb_name",
                                            memb_bank: "$memb_bank",
                                            memb_banking_th: "$memb_banking_th",
                                            memb_banking_en: "$memb_banking_en",
                                            memb_banking_code: "$memb_banking_code",
                                            from_bank_id: "$from_bank_id",
                                            from_account_id: "$from_account_id",
                                            web_account_nameth: "$web_account_nameth",
                                            web_account_nameen: "$web_account_nameen",
                                            web_account_code: "$web_account_code",
                                            web_account_name: "$web_account_name",
                                            web_account_number: "$web_account_number",
                                            to_bank_id: "$to_bank_id",
                                            to_account_id: "$to_account_id",
                                            checked: "$checked",
                                            approve_by: {
                                                $cond: [{
                                                    $eq: [{ $ifNull: ["$emp.username", null] }, null]
                                                },
                                                    null,
                                                {
                                                    approve_by: "$approve_by",
                                                    approve_date: "$approve_date",
                                                    approve_username: "$emp.username",
                                                    approve_name: "$emp.name",
                                                    approve_tel: "$emp.tel",
                                                    approve_role: "$emp.role",
                                                    approve_avatar: "$emp.avatar",
                                                }]
                                            }
                                        }
                                    }, {
                                        $lookup: {
                                            from: "emp_role",
                                            localField: "approve_by.approve_role",
                                            foreignField: "_id",
                                            as: "role"
                                        }
                                    }, {
                                        $unwind: { path: "$role", preserveNullAndEmptyArrays: true }
                                    },
                                
                                    {
                                        $project: {
                                            id: 1,
                                            channel: "$channel",
                                            type: "$type",
                                            sub_type: "$sub_type",
                                            amount: "$amount",
                                            request_date: "$request_date",
                                            status: "$status",
                                            description: "$description",
                                            agent_id: "$agent_id",
                                            web_name: "$web_name",
                                            web_aka: "$web_aka",
                                            web_prefix: "$web_prefix",
                                            memb_id: "$memb_id",
                                            memb_username: "$memb_username",
                                            memb_status: "$memb_status",
                                            memb_name: "$memb_name",
                                            memb_bank: "$memb_bank",
                                            memb_banking_th: "$memb_banking_th",
                                            memb_banking_en: "$memb_banking_en",
                                            memb_banking_code: "$memb_banking_code",
                                            from_bank_id: "$from_bank_id",
                                            from_account_id: "$from_account_id",
                                            web_account_nameth: "$web_account_nameth",
                                            web_account_nameen: "$web_account_nameen",
                                            web_account_code: "$web_account_code",
                                            web_account_name: "$web_account_name",
                                            web_account_number: "$web_account_number",
                                            to_bank_id: "$to_bank_id",
                                            to_account_id: "$to_account_id",
                                            checked: "$checked",
                                            approve_by:
                                            {
                                                approve_by: "$approve_by.approve_by",
                                                approve_date: "$approve_by.approve_date",
                                                approve_username: "$approve_by.approve_username",
                                                approve_name: "$approve_by.approve_name",
                                                approve_tel: "$approve_by.approve_tel",
                                                approve_role: "$role.name",
                                                approve_avatar: "$approve_by.approve_avatar",
                                            }
                                        }
                                    },


                        ]).toArray()
                        .then(result => resolve(result))
                        .catch(error => reject(error));
        });
}

