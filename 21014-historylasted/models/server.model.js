const { MongoDB } = require('../configs/connection_mongodb');
const moment = require('moment');
const { ObjectId } = require('mongodb');


module.exports.getdeposit = () => {
        // console.log(body);
        return new Promise(async (resolve, reject) => {

                await MongoDB.collection('deposit')

                        .aggregate([
                                {
                                        $match: {
                                                $or: [
                                                        { status: "approve" }, { status: "cancel" }
                                                ]
                                        }
                                }, {
                                        $project: {
                                                id: 1,
                                                type: "$type",
                                                sub_type:"$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                agent_id: "$agent_id",
                                                memb_id: "$memb_id",
                                                description:"$description",
                                                from_bank_id: "$from_bank_id",
                                                from_account_id: "$from_account_id",
                                                to_bank_id: "$to_bank_id",
                                                to_account_id: "$to_account_id",
                                                approve_by:"$approve_by",
                                                approve_date:"$approve_date",
                                                check_by: "$check_by",
                                                checked_date: "$checked_date"
                                        }
                                }, {
                                        $lookup: {
                                                from: "member_provider_account",
                                                localField: "memd_id",
                                                foreignField: "memd_id",
                                                as: "memb_prov"
                                        }
                                }, {
                                        $unwind: { path: "$memb_prov" }
                                }, {
                                        $match: {
                                                $expr: {
                                                        $eq: ["$memb_prov.memb_id", "$memb_id"]
                                                }
                                        }
                                }, {
                                        $project: {
                                                id: 1,
                                                type: "$type",
                                                sub_type:"$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description:"$description",
                                                agent_id: "$agent_id",
                                                memb_id: "$memb_id",
                                                memb_username: "$memb_prov.username",
                                                from_bank_id: "$from_bank_id",
                                                from_account_id: "$from_account_id",
                                                to_bank_id: "$to_bank_id",
                                                to_account_id: "$to_account_id",
                                                check_by: "$check_by",
                                                checked_date: "$checked_date",
                                                approve_by:"$approve_by",
                                                approve_date:"$approve_date",
                                        }
                                }, {
                                        $lookup: {
                                                from: "memb_bank_account",
                                                localField: "memd_id",
                                                foreignField: "memd_id",
                                                as: "memb_bank"
                                        }
                                }, {
                                        $unwind: { path: "$memb_bank" }
                                }, {
                                        $match: {
                                                $expr: {
                                                        $eq: ["$memb_bank.memb_id", "$memb_id"]
                                                }
                                        }
                                }, {
                                        $project: {
                                                id: 1,
                                                type: "$type",
                                                sub_type:"$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description:"$description",
                                                agent_id: "$agent_id",
                                                memb_id: "$memb_id",
                                                memb_username: "$memb_username",
                                                memb_name: "$memb_bank.account_name",
                                                memb_bank: "$memb_bank.account_number",
                                                from_bank_id: "$from_bank_id",
                                                from_account_id: "$from_account_id",
                                                to_bank_id: "$to_bank_id",
                                                to_account_id: "$to_account_id",
                                                approve_by:"$approve_by",
                                                approve_date:"$approve_date",
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
                                }, {
                                        $unwind: { path: "$banking_memb" }
                                }, {
                                        $match: {
                                                $expr: {
                                                        $eq: ["$banking_memb_id", "$banking_memb_id.from_bank_id"]
                                                }
                                        }
                                }, {
                                        $project: {
                                                id: 1,
                                                type: "$type",
                                                sub_type:"$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description:"$description",
                                                agent_id: "$agent_id",
                                                memb_id: "$memb_id",
                                                memb_username: "$memb_username",
                                                memb_name: "$memb_name",
                                                memb_bank: "$memb_bank",
                                                memb_banking_th: "$banking_memb.nameth",
                                                memb_banking_en: "$banking_memb.nameen",
                                                memb_banking_code: "$banking_memb.code",
                                                from_bank_id: "$from_bank_id",
                                                from_account_id: "$from_account_id",
                                                to_bank_id: "$to_bank_id",
                                                to_account_id: "$to_account_id",
                                                approve_by:"$approve_by",
                                                approve_date:"$approve_date",
                                                check_by: "$check_by",
                                                checked_date: "$checked_date"
                                        }
                                }, {
                                        $lookup: {
                                                from: "bank",
                                                localField: "to_bank_id",
                                                foreignField: "_id",
                                                as: "banking_agent"
                                        }
                                }, {
                                        $unwind: { path: "$banking_agent" }
                                }, {
                                        $match: {
                                                $expr: {
                                                        $eq: ["$banking_agent_id", "$banking_agent_id.to_bank_id"]
                                                }
                                        }
                                }, {
                                        $project: {
                                                id: 1,
                                                type: "$type",
                                                sub_type:"$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description:"$description",
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
                                                web_account_nameth: "$banking_agent.nameth",
                                                web_account_nameen: "$banking_agent.nameen",
                                                web_account_code: "$banking_agent.code",
                                                to_bank_id: "$to_bank_id",
                                                to_account_id: "$to_account_id",
                                                approve_by:"$approve_by",
                                                approve_date:"$approve_date",
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
                                        $unwind: { path: "$agent_account" }
                                }, {
                                        $match: {
                                                $expr: {
                                                        $eq: ["$agent_account_id", "$agent_account.to_account_id"]
                                                }
                                        }
                                }, {
                                        $project: {
                                                id: 1,
                                                type: "$type",
                                                sub_type:"$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description:"$description",
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
                                                web_account_name: "$agent_account.account_name",
                                                web_account_number: "$agent_account.account_number",
                                                to_bank_id: "$to_bank_id",
                                                to_account_id: "$to_account_id",
                                                approve_by:"$approve_by",
                                                approve_date:"$approve_date",
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
                                        $unwind: { path: "$webagent" }
                                }, {
                                        $match: {
                                                $expr: {
                                                        $eq: ["$agent_id", "$webagent._id"]
                                                }
                                        }
                                }, {
                                        $project: {
                                                id: 1,
                                                type: "$type",
                                                sub_type:"$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description:"$description",
                                                agent_id: "$agent_id",
                                                web_name: "$webagent.domain_name",
                                                web_aka: "$webagent.name",
                                                web_prefix: "$webagent.prefix",
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
                                                approve_by:"$approve_by",
                                                approve_date:"$approve_date",
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
                                        $unwind: { path: "$memb_acc" }
                                }, {
                                        $match: {
                                                $expr: {
                                                        $eq: ["$memb_id", "$memb_acc._id"]
                                                }
                                        }
                                },
                                {
                                        $project: {
                                                id: 1,
                                                type: "$type",
                                                sub_type:"$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description:"$description",
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
                                                approve_by:"$approve_by",
                                                approve_date:"$approve_date",
                                                check_by: "$check_by",
                                                checked_date: "$checked_date"
                                                // Checked:{
                                                //         check_by:"$check_by",
                                                //         checked_date:"$checked_date",
                                                //         checker_username : "$emp.username",
                                                //         checker_name : "$emp.name",
                                                //         checker_tel : "$emp.tel",
                                                //         checker_role : "$emp.role",
                                                //         checker_avatar : "$emp.avatar",
                                                // }
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
                                                type: "$type",
                                                sub_type:"$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description:"$description",
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
                                                approve_by:"$approve_by",
                                                approve_date:"$approve_date",
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
                                {  $lookup: {
                                        from: "emp_role",
                                        localField: "checked.checker_role",
                                        foreignField: "_id",
                                        as: "role"
                                    }
                                },  {
                                        $unwind: { path: "$role", preserveNullAndEmptyArrays: true }
                                }, {
                                        $project: {
                                                id: 1,
                                                type: "$type",
                                                sub_type:"$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description:"$description",
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
                                                approve_by:"$approve_by",
                                                approve_date:"$approve_date",
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
                                {  $lookup: {
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
                                                type: "$type",
                                                sub_type:"$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description:"$description",
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
                                                checked:"$checked",
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
                                },{  $lookup: {
                                        from: "emp_role",
                                        localField: "approve_by.approve_role",
                                        foreignField: "_id",
                                        as: "role"
                                    }
                                },  {
                                        $unwind: { path: "$role", preserveNullAndEmptyArrays: true }
                                },
                                
                                {
                                        $project: {
                                                id: 1,
                                                type: "$type",
                                                sub_type:"$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description:"$description",
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
                                                checked:"$checked",
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

module.exports.getwithdraw = () => {
        // console.log(body);
        return new Promise(async (resolve, reject) => {

                await MongoDB.collection('withdraw')

                        .aggregate([
                                {
                                        $match: {
                                                $or: [
                                                        //{ou_id : ObjectId(payload.ou)},
                                                        //{branch_id : ObjectId(payload.branch)},
                                                        { status: "approve" }, { status: "cancel" }
                                                ]
                                        }
                                }, {
                                        $project: {
                                                id: 1,
                                                type: "$type",
                                                sub_type:"$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description:"$description",
                                                agent_id: "$agent_id",
                                                memb_id: "$memb_id",
                                                from_bank_id: "$from_bank_id",
                                                from_account_id: "$from_account_id",
                                                to_bank_id: "$to_bank_id",
                                                to_account_id: "$to_account_id",
                                                approve_by:"$approve_by",
                                                approve_date:"$approve_date",
                                                check_by: "$check_by",
                                                checked_date: "$checked_date"
                                        }
                                }, {
                                        $lookup: {
                                                from: "member_provider_account",
                                                localField: "memd_id",
                                                foreignField: "memd_id",
                                                as: "memb_prov"
                                        }
                                }, {
                                        $unwind: { path: "$memb_prov" }
                                }, 
                                {
                                        $match: {
                                                $expr: {
                                                        $eq: ["$memb_prov.memb_id", "$memb_id"]
                                                }
                                        }
                                }, 
                                {
                                        $project: {
                                                id: 1,
                                                type: "$type",
                                                sub_type:"$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description:"$description",
                                                agent_id: "$agent_id",
                                                memb_id: "$memb_id",
                                                memb_username: "$memb_prov.username",
                                                from_bank_id: "$from_bank_id",
                                                from_account_id: "$from_account_id",
                                                to_bank_id: "$to_bank_id",
                                                to_account_id: "$to_account_id",
                                                approve_by:"$approve_by",
                                                approve_date:"$approve_date",
                                                check_by: "$check_by",
                                                checked_date: "$checked_date"
                                        }
                                }, {
                                        $lookup: {
                                                from: "memb_bank_account",
                                                localField: "memd_id",
                                                foreignField: "memd_id",
                                                as: "memb_bank"
                                        }
                                }, {
                                        $unwind: { path: "$memb_bank" }
                                }, {
                                        $match: {
                                                $expr: {
                                                        $eq: ["$memb_bank.memb_id", "$memb_id"]
                                                }
                                        }
                                }, {
                                        $project: {
                                                id: 1,
                                                type: "$type",
                                                sub_type:"$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description:"$description",
                                                agent_id: "$agent_id",
                                                memb_id: "$memb_id",
                                                memb_username: "$memb_username",
                                                memb_name: "$memb_bank.account_name",
                                                memb_bank: "$memb_bank.account_number",
                                                from_bank_id: "$from_bank_id",
                                                from_account_id: "$from_account_id",
                                                to_bank_id: "$to_bank_id",
                                                to_account_id: "$to_account_id",
                                                approve_by:"$approve_by",
                                                approve_date:"$approve_date",
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
                                }, {
                                        $unwind: { path: "$banking_memb" }
                                }, {
                                        $match: {
                                                $expr: {
                                                        $eq: ["$banking_memb_id", "$banking_memb_id.to_bank_id"]
                                                }
                                        }
                                }, {
                                        $project: {
                                                id: 1,
                                                type: "$type",
                                                sub_type:"$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description:"$description",
                                                agent_id: "$agent_id",
                                                memb_id: "$memb_id",
                                                memb_username: "$memb_username",
                                                memb_name: "$memb_name",
                                                memb_bank: "$memb_bank",
                                                memb_banking_th: "$banking_memb.nameth",
                                                memb_banking_en: "$banking_memb.nameen",
                                                memb_banking_code: "$banking_memb.code",
                                                from_bank_id: "$from_bank_id",
                                                from_account_id: "$from_account_id",
                                                to_bank_id: "$to_bank_id",
                                                to_account_id: "$to_account_id",
                                                approve_by:"$approve_by",
                                                approve_date:"$approve_date",
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
                                }, {
                                        $unwind: { path: "$banking_agent" }
                                }, {
                                        $match: {
                                                $expr: {
                                                        $eq: ["$banking_agent_id", "$banking_agent_id.from_bank_id"]
                                                }
                                        }
                                }, {
                                        $project: {
                                                id: 1,
                                                type: "$type",
                                                sub_type:"$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description:"$description",
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
                                                web_account_nameth: "$banking_agent.nameth",
                                                web_account_nameen: "$banking_agent.nameen",
                                                web_account_code: "$banking_agent.code",
                                                to_bank_id: "$to_bank_id",
                                                to_account_id: "$to_account_id",
                                                approve_by:"$approve_by",
                                                approve_date:"$approve_date",
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
                                        $unwind: { path: "$agent_account" }
                                }, {
                                        $match: {
                                                $expr: {
                                                        $eq: ["$from_account_id", "$agent_account._id"]
                                                }
                                        }
                                }, {
                                        $project: {
                                                id: 1,
                                                type: "$type",
                                                sub_type:"$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description:"$description",
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
                                                web_account_name: "$agent_account.account_name",
                                                web_account_number: "$agent_account.account_number",
                                                to_bank_id: "$to_bank_id",
                                                to_account_id: "$to_account_id",
                                                approve_by:"$approve_by",
                                                approve_date:"$approve_date",
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
                                        $unwind: { path: "$webagent" }
                                }, {
                                        $match: {
                                                $expr: {
                                                        $eq: ["$agent_id", "$webagent._id"]
                                                }
                                        }
                                }, {
                                        $project: {
                                                id: 1,
                                                type: "$type",
                                                sub_type:"$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description:"$description",
                                                agent_id: "$agent_id",
                                                web_name: "$webagent.domain_name",
                                                web_aka: "$webagent.name",
                                                web_prefix: "$webagent.prefix",
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
                                                approve_by:"$approve_by",
                                                approve_date:"$approve_date",
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
                                        $unwind: { path: "$memb_acc" }
                                }, {
                                        $match: {
                                                $expr: {
                                                        $eq: ["$memb_id", "$memb_acc._id"]
                                                }
                                        }
                                },
                                {
                                        $project: {
                                                id: 1,
                                                type: "$type",
                                                sub_type:"$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description:"$description",
                                                agent_id: "$agent_id",
                                                web_name: "$web_name",
                                                web_aka: "$web_aka",
                                                web_prefix: "$web_prefix",
                                                memb_id: "$memb_id",
                                                memb_username: "$memb_username",
                                                memb_status: "$memb_acc.status",
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
                                                approve_by:"$approve_by",
                                                approve_date:"$approve_date",
                                                check_by: "$check_by",
                                                checked_date: "$checked_date"
                                                
                                        }
                                },
                                {  $lookup: {
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
                                                type: "$type",
                                                sub_type:"$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description:"$description",
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
                                                approve_by:"$approve_by",
                                                approve_date:"$approve_date",
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
                                {  $lookup: {
                                        from: "emp_role",
                                        localField: "checked.checker_role",
                                        foreignField: "_id",
                                        as: "role"
                                    }
                                },  {
                                        $unwind: { path: "$role", preserveNullAndEmptyArrays: true }
                                }, {
                                        $project: {
                                                id: 1,
                                                type: "$type",
                                                sub_type:"$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description:"$description",
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
                                                approve_by:"$approve_by",
                                                approve_date:"$approve_date",
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
                                {  $lookup: {
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
                                                type: "$type",
                                                sub_type:"$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description:"$description",
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
                                                checked:"$checked",
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
                                },{  $lookup: {
                                        from: "emp_role",
                                        localField: "approve_by.approve_role",
                                        foreignField: "_id",
                                        as: "role"
                                    }
                                },  {
                                        $unwind: { path: "$role", preserveNullAndEmptyArrays: true }
                                },
                                
                                {
                                        $project: {
                                                id: 1,
                                                type: "$type",
                                                sub_type:"$sub_type",
                                                amount: "$amount",
                                                request_date: "$request_date",
                                                status: "$status",
                                                description:"$description",
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
                                                checked:"$checked",
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

