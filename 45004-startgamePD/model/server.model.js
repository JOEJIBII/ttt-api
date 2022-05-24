const { MongoDB } = require('../configs/connection_mongodb');
const { ObjectId } = require('mongodb');
const collectionmember = "member-Test"
module.exports.getconf = (payload) => {
    //console.log(body);
    return new Promise(async (resolve, reject) => {
//console.log(CONF[0]._id);
//console.log(payload.agent_id);
        await MongoDB.collection("agent")
            .aggregate([
                {
                    $match : {
                        $and : [
                            { _id : ObjectId(payload.agent_id)}
                        ]
                    }
                },
                {
                    $project:{
                            _id:1,
                            prov_id:"$provider.prov_id",
                            prov_name:"$provider.provider_name",
                            prov_key:"$provider.prov_key",
                            prov_prefix:"$provider.prov_prefix",
                            prov_domain:"$provider.prov_domain",
                            prov_agentusername:"$provider.prov_agentusername",
                            prov_whitelabel:"$provider.prov_whitelabel",
                            username:payload.username
                            
                    }
                },
                
            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}