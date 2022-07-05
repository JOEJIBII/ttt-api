const { MongoDB } = require('../configs/connection_mongodb');
const objectId = require('mongodb').ObjectId;
const dayjs = require('dayjs');
const { ObjectId } = require('mongodb');
const moment = require('moment');
const today = dayjs();
const collectionmember = "member"
const collectionCONFIGURATION = "agent"
module.exports.register = (body, _user) => {
    return new Promise(async (resolve, reject) => {

        await MongoDB.collection(collectionmember)
            .insertOne({
                agent_id: objectId(body.agent_id),
                username: _user,
                password: body.password,
                tel: body.tel,
                mobile_no: body.tel,
                pin: body.pin,
                line_id: body.line_id,
                name: body.name,
                surname: body.surename,
                birthday_date: body.birthday,
                channel: ObjectId(body.channel),
                remark: body.remark,
                ipinfo:body.ipinfo,
                register_date: new Date(moment().format()),
                user_reference: body.user_reference,
                promotion_status: body.promotion_status,
                privilege: ObjectId("62a8d9a4b4839cabb5622db1"),
                financial: {
                    deposit_first_time_amount: 0.00,
                    deposit_first_time: null,
                    deposit_count: 0,
                    deposit_total_amount: 0.00,
                    withdraw_first_time: 0,
                    withdraw_count: 0,
                    withdraw_total_amount: 0.00
                },
                status: 'active',
                status_new_member: 'N',
                cr_date: new Date(moment().format()),
                cr_by: "11000-create-user",
                cr_prog: "11000-create-user",
                upd_date: null,
                upd_by: null,
                upd_prog: null
            })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.registerpanel = (body, ip, _user) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionmember)
            .insertOne({
                agent_id: objectId(body.agent_id),
                username: _user,
                password: body.password,
                tel: body.tel,
                mobile_no: body.mobile_number,
                pin: body.pin,
                line_id: body.line_id,
                name: body.name,
                surname: body.surename,
                birthday_date: body.birthday,
                email:body.email,
                // tag: body.tag.map(e => {
                //     return objectId(e)
                // }),
                channel: ObjectId(body.channel),
                remark: body.remark,
                register_ip: body.register_ip,
                register_date: new Date(moment().format()),
                user_reference: body.user_reference,
                //promotion_status: body.promotion_status,
                privilege: ObjectId(body.privilege),
                financial: {
                    deposit_first_time_amount: 0.00,
                    deposit_first_time: null,
                    deposit_count: 0,
                    deposit_total_amount: 0.00,
                    withdraw_first_time: 0,
                    withdraw_count: 0,
                    withdraw_total_amount: 0.00
                },
                status: 'active',
                status_new_member: 'N',
                cr_date: new Date(moment().format()),
                cr_by: "11000-create-user",
                cr_prog: "11000-create-user",
                upd_date: null,
                upd_by: null,
                upd_prog: null
            })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.findConF = (body) => {
    //console.log(JSON.stringify(body))
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionCONFIGURATION)
            .findOneAndUpdate(
                {
                    _id: ObjectId(body.agent_id)
                },
                {
                    $inc: {
                        "member.running_number": 1
                    }
                },

            )
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}



module.exports.createaccountprovider = (body, _id, CONF, _user) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('member_provider_account')
            .insertOne({
                memb_id: _id,
                username: _user,
                password: CONF.value.prefix + "123456",
                prov_id: CONF.value.provider.prov_id,
                flagregister: "N",
                cr_by: "11000-create-user",
                cr_date: new Date(moment().format()),
                cr_prog: "11000-create-user",
            })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.createaccountprovider = (body, _id, CONF, _user) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('member_provider_account')
            .insertOne({
                memb_id: _id,
                username: _user,
                password: CONF.value.prefix + "123456",
                prov_id: CONF.value.provider.prov_id,
                flagregister: "N",
                cr_by: "11000-create-user",
                cr_date: new Date(moment().format()),
                cr_prog: "11000-create-user",
            })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.insertmembturnover = (memb_id, body) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('memb_turnover')
            .insertOne({
                memb_id: ObjectId(memb_id),
                agent_id: ObjectId(body.agent_id),
                turnover: parseFloat(0),
                description: null,
                status: "active",
                cr_by: "11000-create-user",
                cr_date: new Date(moment().format()),
                cr_prog: "11000-create-user",
                upd_by: null,
                upd_date: null,
                upd_prog: null,
            })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.insertbankmemb = (memb_id, body) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('memb_bank_account')
            .insertOne({
                memb_id: ObjectId(memb_id),
                agent_id: ObjectId(body.agent_id),
                bank_id: ObjectId(body.bank_id),
                account_number: body.bank_acct,
                account_name: body.name + " " + body.surename,
                description: null,
                status: "active",
                cr_by: "11000-create-user",
                cr_date: new Date(moment().format()),
                cr_prog: "11000-create-user",
                upd_by: null,
                upd_date: null,
                upd_prog: null
            })
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}


module.exports.CheckBankAccount = (body) => {
    return new Promise(async (resolve, reject) => {
       
        //console.log("test", body.agent_id, body.bank_acct, body.bank_id)

        await MongoDB.collection('memb_bank_account')

            .aggregate([
                {
                    $match: {
                        $and: [{
                            agent_id: ObjectId(body.agent_id)
                        }, { bank_id: ObjectId(body.bank_id) }, {
                            $or: [{
                                account_number: body.bank_acct
                            },
                            ]
                        }]
                    }
                },


            ]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}


module.exports.CheckTel = (body) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionmember)
            .aggregate([{
                $match: {
                    '$and': [
                        { agent_id: ObjectId(body.agent_id) },
                        { tel: body.tel }
                    ]
                },
            }]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.get_acct_pd = (_id) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('member_provider_account')
            .aggregate([{
                $match: {
                    '$and': [
                        { agent_id: ObjectId(_id) },
                    ]
                },
            }]).toArray()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}
module.exports.removemember = (_id) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection(collectionmember).deleteOne({
            _id: ObjectId(_id)
        }
        )

            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports.removememberpd = (_id) => {
    return new Promise(async (resolve, reject) => {
        await MongoDB.collection('member_provider_account')
            .deleteOne({
                _id: ObjectId(_id)
            }
            )
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}