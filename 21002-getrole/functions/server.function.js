const { MongoDB } = require('../configs/connection_mongodb');
const moment = require('moment');
const collectionhistory_log_api ="history_log_api"

module.exports.logs = (body,ip) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionhistory_log_api)
        .insertOne({
            memb_id:body.agent_id,
            api_name:"21002-getrole",
            ip_address:ip,
            create_date:moment().format()
        })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.Mappingdata = async (roles,emp_role) => {
    return new Promise(async (resolve) => {
        let role = []
        let agent = {}
        roles.forEach(e => {
            if(e.name != emp_role){
                
                role = role.concat(e)
            }
        })
        //console.log(memb)
        resolve({ 
        "role": role.map(e => {
                return {
                    _id:Object(e._id),
                    role: e.name,
                    description: e.description
                }
            
            
        })
        },)
    })
    }