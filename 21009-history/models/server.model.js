const { MongoDB } = require('../configs/connection_mongodb');
const moment = require('moment');
const { ObjectId } = require('mongodb');


module.exports.getdeposit = () => {
    // console.log(body);
     return new Promise(async (resolve, reject) => {
 
         await MongoDB.collection('deposit')
        
         .aggregate([
            {
                $match : {
                   $or:[
                        //{ou_id : ObjectId(payload.ou)},
                      //{branch_id : ObjectId(payload.branch)},
                        {status:"pending"},{status:"check"}
                    ]
                }
            }, {
                $project:{
                        id:1,
                        type:"$type",
                        amount:"$amount",
                        request_date:"$request_date",
                        status:"$status",
                        agent_id:"$agent_id",
                        memb_id:"$memb_id",
                        from_bank_id:"$from_bank_id",
                        from_account_id:"$from_account_id",
                        to_bank_id:"$to_bank_id",
                        to_account_id:"$to_account_id"
                }
            },{$lookup:{
                    from:"member_provider_account",
                    localField:"memd_id",
                    foreignField:"memd_id",
                    as:"memb_prov"
}},  {
       $unwind:{ path:"$memb_prov"}
         }, {
                     $match: {
                               $expr: {
                                       $eq: ["$memb_prov.memb_id", "$memb_id"]
                                        }
                           }
},{
                $project:{
                        id:1,
                        type:"$type",
                        amount:"$amount",
                        request_date:"$request_date",
                        status:"$status",
                        agent_id:"$agent_id",
                        memb_id:"$memb_id",
                        memb_username:"$memb_prov.username",
                        from_bank_id:"$from_bank_id",
                        from_account_id:"$from_account_id",
                        to_bank_id:"$to_bank_id",
                        to_account_id:"$to_account_id"
                }
            },{$lookup:{
                    from:"memb_bank_account",
                    localField:"memd_id",
                    foreignField:"memd_id",
                    as:"memb_bank"
}},  {
       $unwind:{ path:"$memb_bank"}
         },{
                     $match: {
                               $expr: {
                                       $eq: ["$memb_bank.memb_id", "$memb_id"]
                                        }
                           }
},{
                $project:{
                        id:1,
                        type:"$type",
                        amount:"$amount",
                        request_date:"$request_date",
                        status:"$status",
                        agent_id:"$agent_id",
                        memb_id:"$memb_id",
                        memb_username:"$memb_username",
                        memb_name:"$memb_bank.account_name",
                        memb_bank:"$memb_bank.account_number",
                        from_bank_id:"$from_bank_id",
                        from_account_id:"$from_account_id",
                        to_bank_id:"$to_bank_id",
                        to_account_id:"$to_account_id"
                }
            },{$lookup:{
                    from:"bank",
                    localField:"from_bank_id",
                    foreignField:"_id",
                    as:"banking_memb"
}},  {
       $unwind:{ path:"$banking_memb"}
         }, {
                     $match: {
                               $expr: {
                                       $eq: ["$banking_memb_id", "$banking_memb_id.from_bank_id"]
                                        }
                           }
},{
                $project:{
                        id:1,
                        type:"$type",
                        amount:"$amount",
                        request_date:"$request_date",
                        status:"$status",
                        agent_id:"$agent_id",
                        memb_id:"$memb_id",
                        memb_username:"$memb_username",
                        memb_name:"$memb_name",
                        memb_bank:"$memb_bank",
                        memb_banking_th:"$banking_memb.nameth",
                        memb_banking_en:"$banking_memb.nameen",
                        memb_banking_code:"$banking_memb.code",
                        from_bank_id:"$from_bank_id",
                        from_account_id:"$from_account_id",
                        to_bank_id:"$to_bank_id",
                        to_account_id:"$to_account_id"
                }
            },{$lookup:{
                    from:"bank",
                    localField:"to_bank_id",
                    foreignField:"_id",
                    as:"banking_agent"
}},  {
       $unwind:{ path:"$banking_agent"}
         }, {
                     $match: {
                               $expr: {
                                       $eq: ["$banking_agent_id", "$banking_agent_id.to_bank_id"]
                                        }
                           }
},{
                $project:{
                        id:1,
                        type:"$type",
                        amount:"$amount",
                        request_date:"$request_date",
                        status:"$status",
                        agent_id:"$agent_id",
                        memb_id:"$memb_id",
                        memb_username:"$memb_username",
                        memb_name:"$memb_name",
                        memb_bank:"$memb_bank",
                        memb_banking_th:"$memb_banking_th",
                        memb_banking_en:"$memb_banking_en",
                        memb_banking_code:"$memb_banking_code",
                        from_bank_id:"$from_bank_id",
                        from_account_id:"$from_account_id",
                        web_account_nameth:"$banking_agent.nameth",
                        web_account_nameen:"$banking_agent.nameen",
                        web_account_code:"$banking_agent.code",
                        to_bank_id:"$to_bank_id",
                        to_account_id:"$to_account_id"
                }
            },
            {$lookup:{
                    from:"agent_bank_account",
                    localField:"to_account_id",
                    foreignField:"_id",
                    as:"agent_account"
}},
             {
       $unwind:{ path:"$agent_account"}
         }, {
                     $match: {
                               $expr: {
                                       $eq: ["$agent_account_id", "$agent_account.to_account_id"]
                                        }
                           }
},{
                $project:{
                        id:1,
                        type:"$type",
                        amount:"$amount",
                        request_date:"$request_date",
                        status:"$status",
                        agent_id:"$agent_id",
                        memb_id:"$memb_id",
                        memb_username:"$memb_username",
                        memb_name:"$memb_name",
                        memb_bank:"$memb_bank",
                        memb_banking_th:"$memb_banking_th",
                        memb_banking_en:"$memb_banking_en",
                        memb_banking_code:"$memb_banking_code",
                        from_bank_id:"$from_bank_id",
                        from_account_id:"$from_account_id",
                        web_account_nameth:"$web_account_nameth",
                        web_account_nameen:"$web_account_nameen",
                        web_account_code:"$web_account_code",
                        web_account_name:"$agent_account.account_name",
                        web_account_number:"$agent_account.account_number",
                        to_bank_id:"$to_bank_id",
                        to_account_id:"$to_account_id"
                }
            },
             {$lookup:{
                    from:"agent",
                    localField:"agent_id",
                    foreignField:"_id",
                    as:"webagent"
}},
             {
       $unwind:{ path:"$webagent"}
         }, {
                     $match: {
                               $expr: {
                                       $eq: ["$agent_id", "$webagent._id"]
                                        }
                           }
},{
                $project:{
                        id:1,
                        type:"$type",
                        amount:"$amount",
                        request_date:"$request_date",
                        status:"$status",
                        agent_id:"$agent_id",
                        web_name:"$webagent.domain_name",
                        web_aka:"$webagent.name",
                        memb_id:"$memb_id",
                        memb_username:"$memb_username",
                        memb_name:"$memb_name",
                        memb_bank:"$memb_bank",
                        memb_banking_th:"$memb_banking_th",
                        memb_banking_en:"$memb_banking_en",
                        memb_banking_code:"$memb_banking_code",
                        from_bank_id:"$from_bank_id",
                        from_account_id:"$from_account_id",
                        web_account_nameth:"$web_account_nameth",
                        web_account_nameen:"$web_account_nameen",
                        web_account_code:"$web_account_code",
                        web_account_name:"$web_account_name",
                        web_account_number:"$web_account_number",
                        to_bank_id:"$to_bank_id",
                        to_account_id:"$to_account_id"
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
                $match : {
                   $or:[
                        //{ou_id : ObjectId(payload.ou)},
                      //{branch_id : ObjectId(payload.branch)},
                        {status:"pending"},{status:"check"}
                    ]
                }
            }, {
                $project:{
                        id:1,
                        type:"$type",
                        amount:"$amount",
                        request_date:"$request_date",
                        status:"$status",
                        agent_id:"$agent_id",
                        memb_id:"$memb_id",
                        from_bank_id:"$from_bank_id",
                        from_account_id:"$from_account_id",
                        to_bank_id:"$to_bank_id",
                        to_account_id:"$to_account_id"
                }
            },{$lookup:{
                    from:"member_provider_account",
                    localField:"memd_id",
                    foreignField:"memd_id",
                    as:"memb_prov"
}},  {
       $unwind:{ path:"$memb_prov"}
         }, {
                     $match: {
                               $expr: {
                                       $eq: ["$memb_prov.memb_id", "$memb_id"]
                                        }
                           }
},{
                $project:{
                        id:1,
                        type:"$type",
                        amount:"$amount",
                        request_date:"$request_date",
                        status:"$status",
                        agent_id:"$agent_id",
                        memb_id:"$memb_id",
                        memb_username:"$memb_prov.username",
                        from_bank_id:"$from_bank_id",
                        from_account_id:"$from_account_id",
                        to_bank_id:"$to_bank_id",
                        to_account_id:"$to_account_id"
                }
            },{$lookup:{
                    from:"memb_bank_account",
                    localField:"memd_id",
                    foreignField:"memd_id",
                    as:"memb_bank"
}},  {
       $unwind:{ path:"$memb_bank"}
         },{
                     $match: {
                               $expr: {
                                       $eq: ["$memb_bank.memb_id", "$memb_id"]
                                        }
                           }
},{
                $project:{
                        id:1,
                        type:"$type",
                        amount:"$amount",
                        request_date:"$request_date",
                        status:"$status",
                        agent_id:"$agent_id",
                        memb_id:"$memb_id",
                        memb_username:"$memb_username",
                        memb_name:"$memb_bank.account_name",
                        memb_bank:"$memb_bank.account_number",
                        from_bank_id:"$from_bank_id",
                        from_account_id:"$from_account_id",
                        to_bank_id:"$to_bank_id",
                        to_account_id:"$to_account_id"
                }
            },{$lookup:{
                    from:"bank",
                    localField:"to_bank_id",
                    foreignField:"_id",
                    as:"banking_memb"
}},  {
       $unwind:{ path:"$banking_memb"}
         }, {
                     $match: {
                               $expr: {
                                       $eq: ["$banking_memb_id", "$banking_memb_id.to_bank_id"]
                                        }
                           }
},{
                $project:{
                        id:1,
                        type:"$type",
                        amount:"$amount",
                        request_date:"$request_date",
                        status:"$status",
                        agent_id:"$agent_id",
                        memb_id:"$memb_id",
                        memb_username:"$memb_username",
                        memb_name:"$memb_name",
                        memb_bank:"$memb_bank",
                        memb_banking_th:"$banking_memb.nameth",
                        memb_banking_en:"$banking_memb.nameen",
                        memb_banking_code:"$banking_memb.code",
                        from_bank_id:"$from_bank_id",
                        from_account_id:"$from_account_id",
                        to_bank_id:"$to_bank_id",
                        to_account_id:"$to_account_id"
                }
            },{$lookup:{
                    from:"bank",
                    localField:"from_bank_id",
                    foreignField:"_id",
                    as:"banking_agent"
}},  {
       $unwind:{ path:"$banking_agent"}
         }, {
                     $match: {
                               $expr: {
                                       $eq: ["$banking_agent_id", "$banking_agent_id.from_bank_id"]
                                        }
                           }
},{
                $project:{
                        id:1,
                        type:"$type",
                        amount:"$amount",
                        request_date:"$request_date",
                        status:"$status",
                        agent_id:"$agent_id",
                        memb_id:"$memb_id",
                        memb_username:"$memb_username",
                        memb_name:"$memb_name",
                        memb_bank:"$memb_bank",
                        memb_banking_th:"$memb_banking_th",
                        memb_banking_en:"$memb_banking_en",
                        memb_banking_code:"$memb_banking_code",
                        from_bank_id:"$from_bank_id",
                        from_account_id:"$from_account_id",
                        web_account_nameth:"$banking_agent.nameth",
                        web_account_nameen:"$banking_agent.nameen",
                        web_account_code:"$banking_agent.code",
                        to_bank_id:"$to_bank_id",
                        to_account_id:"$to_account_id"
                }
            },
            {$lookup:{
                    from:"agent_bank_account",
                    localField:"from_account_id",
                    foreignField:"_id",
                    as:"agent_account"
}},
             {
       $unwind:{ path:"$agent_account"}
         }, {
                     $match: {
                               $expr: {
                                       $eq: ["$from_account_id", "$agent_account._id"]
                                        }
                           }
},{
                $project:{
                        id:1,
                        type:"$type",
                        amount:"$amount",
                        request_date:"$request_date",
                        status:"$status",
                        agent_id:"$agent_id",
                        memb_id:"$memb_id",
                        memb_username:"$memb_username",
                        memb_name:"$memb_name",
                        memb_bank:"$memb_bank",
                        memb_banking_th:"$memb_banking_th",
                        memb_banking_en:"$memb_banking_en",
                        memb_banking_code:"$memb_banking_code",
                        from_bank_id:"$from_bank_id",
                        from_account_id:"$from_account_id",
                        web_account_nameth:"$web_account_nameth",
                        web_account_nameen:"$web_account_nameen",
                        web_account_code:"$web_account_code",
                        web_account_name:"$agent_account.account_name",
                        web_account_number:"$agent_account.account_number",
                        to_bank_id:"$to_bank_id",
                        to_account_id:"$to_account_id"
                }
            },
             {$lookup:{
                    from:"agent",
                    localField:"agent_id",
                    foreignField:"_id",
                    as:"webagent"
}},
             {
       $unwind:{ path:"$webagent"}
         }, {
                     $match: {
                               $expr: {
                                       $eq: ["$agent_id", "$webagent._id"]
                                        }
                           }
},{
                $project:{
                        id:1,
                        type:"$type",
                        amount:"$amount",
                        request_date:"$request_date",
                        status:"$status",
                        agent_id:"$agent_id",
                        web_name:"$webagent.domain_name",
                        web_aka:"$webagent.name",
                        memb_id:"$memb_id",
                        memb_username:"$memb_username",
                        memb_name:"$memb_name",
                        memb_bank:"$memb_bank",
                        memb_banking_th:"$memb_banking_th",
                        memb_banking_en:"$memb_banking_en",
                        memb_banking_code:"$memb_banking_code",
                        from_bank_id:"$from_bank_id",
                        from_account_id:"$from_account_id",
                        web_account_nameth:"$web_account_nameth",
                        web_account_nameen:"$web_account_nameen",
                        web_account_code:"$web_account_code",
                        web_account_name:"$web_account_name",
                        web_account_number:"$web_account_number",
                        to_bank_id:"$to_bank_id",
                        to_account_id:"$to_account_id"
                }
            },
         
           
        ]).toArray()
             .then(result => resolve(result))
             .catch(error => reject(error));
     });
 }

