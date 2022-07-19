const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const { ObjectId } = require('mongodb');
const collectionmember = "member"
const collectionCONFIGURATION ="configuration"
//const collectionhistory_log_api ="history_log_api"
module.exports.getdetailmember = (user_id,agent_id) => {
   // console.log(body);
    return new Promise(async (resolve, reject) => {
//console.log(CONF[0]._id);
console.log(agent_id);
        await MongoDB.collection(collectionmember)
       
        .aggregate([
            {
                $match : {
                    $and : [
                        //{ou_id : ObjectId(payload.ou)},
                      //{branch_id : ObjectId(payload.branch)},
                        { _id : ObjectId(user_id),
                          agent_id : ObjectId(agent_id)
                        }

                    ]
                }
            },
            {
              $project: {
                  _id: 1,
                  username: "$username",
                  line_id: "$line_id",
                  agent_id: "$agent_id",
                  tel: "$tel",
                  profile: {
                      name: "$name",
                      surename: "$surname",
                      pin: "$pin",
                      register_ip: "$register_ip",
                      user_reference: "$user_reference",
                      email: "$email",
                      birthday_date: "$birthday_date",
                      mobile_number: "$mobile_no",
                      privilege: "$privilege",
                      channel: "$channel",
                      partner: "$partner",
                      note: "$remark"
                  },
                  banking_account: "$banking_account",
                  financial: "$financial",
                  status: "$status",
                  create_date: "$cr_date",
                  update_date: "$upd_date",
                  update_by: "$upd_by"
      
              }
          }, {
              $lookup: {
                  from: "agent",
                  localField: "agent_id",
                  foreignField: "_id",
                  as: "channel"
              }
          }, {
              $unwind: { path: "$channel" }
          }, {
              $project: {
                  _id: 1,
                  username: "$username",
                  line_id: "$line_id",
                  agent_id: "$agent_id",
                  tel: "$tel",
                  profile: {
                      name: "$profile.name",
                      surename: "$profile.surename",
                      pin: "$profile.pin",
                      register_ip: "$profile.register_ip",
                      user_reference: "$profile.user_reference",
                      email: "$profile.email",
                      birthday_date: "$profile.birthday_date",
                      mobile_number: "$profile.mobile_number",
                      privilege: "$profile.privilege",
                      channel: "$channel.channel",
                      channel_id: "$profile.channel",
                      partner: "$profile.partner",
                      note: "$profile.note"
                  },
                  banking_account: "$banking_account",
                  financial: "$financial",
                  status: "$status",
                  create_date: "$create_date",
                  update_date: "$update_date",
                  update_by: "$update_by"
      
              }
          },
          {
              $unwind: { path: "$profile.channel" }
          },
          {
              $match: {
                  $expr: {
                      $eq: ["$profile.channel.channel_id", "$profile.channel_id"]
                  }
              }
          },
          {
              $lookup: {
                  from: "memb_bank_account",
                  localField: "_id",
                  foreignField: "memb_id",
                  as: "bank_memb"
              }
          },
          {
              $unwind: { path: "$bank_memb" }
          },
          {
              $project: {
                  _id: 1,
                  username: "$username",
                  line_id: "$line_id",
                  agent_id: "$agent_id",
                  tel: "$tel",
                  profile: "$profile",
                  bank_id: "$bank_memb.bank_id",
                  bank_account_name: "$bank_memb.account_name",
                  bank_account_number: "$bank_memb.account_number",
                  bank_account_status: "$bank_memb.status",
                  financial: "$financial",
                  status: "$status",
                  create_date: "$create_date",
                  update_date: "$update_date",
                  update_by: "$update_by"
      
              }
          },
          {
              $lookup: {
                  from: "bank",
                  localField: "bank_id",
                  foreignField: "_id",
                  as: "bank"
              }
          },
          {
              $unwind: { path: "$bank" }
          },
          {
              $project: {
                  _id: 1,
                  username: "$username",
                  line_id: "$line_id",
                  agent_id: "$agent_id",
                  tel: "$tel",
                  profile: "$profile",
                  banking_account: [{
                      bank_id: "$bank_id",
                      bank_acct: "$bank_account_number",
                      bank_acct_name: "$bank_account_name",
                      bank_name: "$bank.nameen",
                      bank_name_th: "$bank.nameth",
                      bank_code: "$bank.code",
                      bank_status: "$bank_account_status"
                  }],
                  financial: "$financial",
                  status: "$status",
                  create_date: "$create_date",
                  update_date: "$update_date",
                  update_by: "$update_by"
      
              }
          },
          {
              $lookup: {
                  from: "agent",
                  localField: "agent_id",
                  foreignField: "_id",
                  as: "agent"
              }
          },
          {
              $unwind: { path: "$agent" }
          },
          {
              $project: {
                  _id: 1,
                  username: "$username",
                  line_id: "$line_id",
                  web_id: "$agent_id",
                  web_name: "$agent.name",
                  url: "$agent.domain_name",
                  url_login: "$agent.url_login",
                  tel: "$tel",
                  profile: "$profile",
                  banking_account: "$banking_account",
                  financial: "$financial",
                  status: "$status",
                  create_date: "$create_date",
                  update_date: "$update_date",
                  update_by: "$update_by"
      
              }
          },
          {
              $lookup: {
                  from: "member_provider_account",
                  localField: "_id",
                  foreignField: "memb_id",
                  as: "pd"
              }
          },
          {
              $unwind: { path: "$pd" }
          },
          {
              $project: {
                  _id: 1,
                  username: "$username",
                  username_pd: "$pd.username",
                  line_id: "$line_id",
                  web_id: "$agent_id",
                  web_name: "$agent.name",
                  url: "$agent.domain_name",
                  url_login: "$agent.url_login",
                  tel: "$tel",
                  profile: "$profile",
                  banking_account: "$banking_account",
                  financial: "$financial",
                  status: "$status",
                  create_date: "$create_date",
                  update_date: "$update_date",
                  update_by: "$update_by"
      
              }
          },
                  
            
            
            
        ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}


module.exports.getconfig_pd = (agent_id) => {
  // console.log(body);
  return new Promise(async (resolve, reject) => {

      await MongoDB.collection('agent')

          .aggregate([
              {
                  $match: {
                      $and: [
                          //{ou_id : ObjectId(payload.ou)},
                          //{branch_id : ObjectId(payload.branch)},
                          {
                              _id: ObjectId(agent_id)
                          },

                      ]
                  }
              },
              {
                  $project: {
                      id: 1,
                      prov_key: "$provider.prov_key",
                      prov_prefix: "$provider.prov_prefix",
                      prov_domain: "$provider.prov_domain",
                      prov_agentusername: "$provider.prov_agentusername",
                      prov_whitelabel: "$provider.prov_whitelabel",

                  }
              },

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
                $match : {
                    $and : [
                        //{ou_id : ObjectId(payload.ou)},
                      //{branch_id : ObjectId(payload.branch)},
                        {domain_name : body.domain_name}
                    ]
                }
            },
            
        ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}