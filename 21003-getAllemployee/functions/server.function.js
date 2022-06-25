const { MongoDB } = require('../configs/connection_mongodb');
const moment = require('moment');
const { ObjectId } = require('mongodb');
const collectionhistory_log_api ="history_log_api"

module.exports.logs = (body,ip) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionhistory_log_api)
        .insertOne({
            memb_id:body.agent_id,
            api_name:"21003-getallemployee",
            ip_address:ip,
            create_date:new Date(moment().format())
        })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.Mappingdata = async (emp,emp_id_request) => {
    return new Promise(async (resolve) => {
        let emp_return = []
      //  console.log("rolelevel",rolelevel)
      emp.forEach(e => {
        let _id = ObjectId(emp_id_request)
         // console.log(e._id,_id)
         
            if(e._id != emp_id_request){
                
                emp_return = emp_return.concat(e)
            }
        })
        //console.log(memb)
        resolve({ 
        "emp": emp_return.map(e => {
                return {
                    _id:Object(e._id),
                    web:e.web,
                    web_id:e.web_id,
                    username:e.username,
                    password:e.password,
                    name:e.name,
                    tel:e.tel,
                    role:e.role,
                    role_description:e.role_description,
                    avatar:e.avatar,
                    status:e.status,
                    crate_by:e.crate_by,
                    crate_date:e.crate_date,
                    update_by:e.update_by,
                    update_date:e.update_date,

                }
            
            
        })
        },)
    })
    }