const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
//const jwt = require('jsonwebtoken');
const moment = require('moment');
const { ObjectId } = require('mongodb');
//const crypto = require('crypto');



module.exports.updatepassword = (memb_id,agent_id,pass) => {
    //console.log(memb_id);console.log(agent_id);console.log(amount);console.log(note);
    // const salt = await bcrypt.genSalt(10)
    // const passddd = await bcrypt.hash(pass,salt);
    // console.log(passddd)
    // console.log("salt",salt)
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('member-Test')
        .updateOne({_id: ObjectId(memb_id), agent_id : ObjectId(agent_id)},
        {
            $set : {
                //turnover : body.amount,
                pin: pass,
                upd_by : ObjectId(memb_id),
                upd_date : new Date(moment().format()),
                upd_prog : "11002-update-password"
            },
        },)
            .then(result => resolve(result))
            .catch(error => reject(error));
        
            
    });
}


// module.exports.encryption = (pass) => {
//     const salt = 10
//     console.log(salt)
//     return new Promise(async (resolve, reject) => {
//     await crypto.hash(pass,salt)
//             .then(hash => resolve(hash))
//             .catch(error => reject(error));
//     });
// }

// module.exports.find_session = (_id,pass) => {
    
//     //const salt = 10
//     //bcrypt.hash(pass,salt).then((hash)) => {}
//     // console.log(passddd)
//     // console.log("salt",salt)
//     return new Promise(async (resolve, reject) => {
//     await MongoDB.collection('member-Test').aggregate([
//             {
//                 $match : {
//                     $and : [
                   
//                         {_id : ObjectId(_id)},
//                         // {password :pass }
                    
//                     ]
//                 }
//             },
//             {
//                 $project :{
//                 _id:1,
//                 username:"$username",
//                 password :"$password"
//                 }
//             }
//         ]).toArray()
//             .then(result => resolve(result))
//             .catch(error => reject(error));
//     });
// }