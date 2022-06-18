const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const dayjs = require('dayjs');
const { ObjectId } = require('mongodb');
module.exports.getwithdrawhistory = (payload) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('withdraw')
        .aggregate([
            {
                $match: {
                    $and: [{
                        agent_id: ObjectId(payload.agent_id),
                        memb_id: ObjectId(payload.user_id)
                    },]
                }
            },{$lookup:{
            from:"bank",
            localField:"from_bank_id",
            foreignField:"_id",
            as:"bankfrom"
    }},  {
            $unwind:{ path:"$bankfrom"}
              }, 
             {
            $project:{
                    _id:1,
                    agent_id:"$agent_id",
                    date : "$date",
                    memb_id : "$memb_id",
                    from_bank_id : "$from_bank_id",
                    from_account:"$from_account",
                    from_bank_name_th : "$bankfrom.nameth",
                    from_bank_name_en : "$bankfrom.nameen",
                    from_bank_code : "$bankfrom.code",
                    member_name: "$member_name",
                    to_bank_id: "$to_bank_id",
                    to_account: "$to_account",
                    amount: "$amount",
                    silp_date: "$silp_date",
                    silp_image: "$silp_image",
                    request_by: "$request_by",
                    request_date: "$request_date",
                    approve_by: "$approve_by",
                    approve_date: "$approve_date",
                    status: "$status",
                    description: "$description",
                    cr_by: "$cr_by",
                    cr_date: "$cr_date",
                    upd_by: "$upd_by",
                    upd_date: "$upd_date",
            }
        },{$lookup:{
            from:"bank",
            localField:"to_bank_id",
            foreignField:"_id",
            as:"bankto"
    }},  {
            $unwind:{ path:"$bankto"}
              }, {
            $project:{
                    _id:1,
                    agent_id:"$agent_id",
                    date : "$date",
                    memb_id : "$memb_id",
                    from_bank_id : "$from_bank_id",
                    from_account:"$from_account",
                    from_bank_name_th : "$from_bank_name_th",
                    from_bank_name_en : "$from_bank_name_en",
                    from_bank_code : "$from_bank_code",
                    member_name: "$member_name",
                    to_bank_id: "$to_bank_id",
                    to_account: "$to_account",
                    to_bank_name_th : "$bankto.nameth",
                    to_bank_name_en : "$bankto.nameen",
                    to_bank_code : "$bankto.code",
                    amount: "$amount",
                    silp_date: "$silp_date",
                    silp_image: "$silp_image",
                    request_by: "$request_by",
                    request_date: "$request_date",
                    approve_by: "$approve_by",
                    approve_date: "$approve_date",
                    status: "$status",
                    description: "$description",
                    cr_by: "$cr_by",
                    cr_date: "$cr_date",
                    upd_by: "$upd_by",
                    upd_date: "$upd_date",
            }
        }
            
        ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
        
            
    });
}
