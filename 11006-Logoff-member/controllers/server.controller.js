const model = require('../models/server.model');
const functions = require('../functions/server.function');


module.exports.logoff = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    const payload = JSON.parse(req.headers.payload)
    //console.log(payload.user_id)
    try {
            const find = await model.find_session(payload.user_id).catch(() => { throw err });
            //console.log(find.length)
            if(find.length > 0){
                const remove =   await model.remove_session(find[0]._id).catch(() => { throw err }); 
                if (remove.deletedCount > 0){
                    res.send({
                        status: "200",
                        message: "success"
      
                    }).end();
                }
            }else{
                res.send({
                    status: "200",
                    message: "success"
    
                }).end();
            }

    } catch (error) {
        //console.error(error);
        res.send({ status: "300", message: 'internal error' }).end();
    }
}