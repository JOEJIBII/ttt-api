// tel : 125a8aar3
// bank_id ObjectId("6280b6899826206073109d4b") 
// account no : "1234567890"

db.getCollection("member-Test").aggregate([
                {
                    $match : {
                        $or: [{
                            username : "Nicky999"
                        },{
                            tel : "125a8aar3"
                        },{
                            $and :[{
                                "banking_account.bank_id" : ObjectId("6280b6899826206073109d4b")
                            },{
                                "banking_account.bank_acct" : "1234567890"
                            }]
                        }]                        
                    }
                },
{
                    $unwind : {path : "$banking_account" , preserveNullAndEmptyArrays:true}
                },
                {
                    $project : {
                               duplicate_username : {$cond : [{$eq : ["$username", "Nicky999"]}, 1,0]},
                        duplicate_tel : {$cond : [{$eq : ["$tel", "125a8aar3"]}, 1,0]},
                         duplicate_x : {$cond : [{$eq : ["$banking_account.bank_id", ObjectId("6280b6899826206073109d4b")]}, 1,0]},
                        duplicate_bank : {$cond : [{$eq : ["$banking_account.bank_acct", "1234567890"]}, 1,0]},
                    }
                },
                {
                    $group : {
                        _id : 1,
                              duplicate_username : {$sum : "$duplicate_username"},
                        duplicate_tel : {$sum : "$duplicate_tel"},
                        duplicate_bank : {$sum : "$duplicate_bank"}
                    }
                },
{
                    $project : {
                        duplicate_username : {$cond : [{$gt : ["$duplicate_username", 0]}, true,false]},
                         duplicate_tel : {$cond : [{$gt : ["$duplicate_tel", 0]}, true,false]},
                        duplicate_bank : {$cond : [{$gt : ["$duplicate_bank", 0]}, true,false]},
                    }
                }
                
            ])