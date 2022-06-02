db.getCollection("member-Test").aggregate([{
    $match : {
        '$and': [
                    { agent_id: new ObjectId("6281446d5aa7df0156f3b467") },
                ]}
                   
               
    },{
        $project:{
            _id:1,
            username:"$username",
            username:"$username",
            line_id:"$line_id",
                            profile:{
                                name:"$name",
                                surename:"$surname",
                                birthday_date:"$birthday",
                                tel:"$tel",
                                privilege:"$member_profile.memb_privilege",
                                channel:"$channel",
                                partner:"$member_profile.memb_partner",
                                note:"$remark"
                               },
                            banking_account:"$banking_account",
                            financial:"$financial",
                            status:"$status",
                            status_newmember:"$status_new_member",
                            
                             create_date:"$cr_date",
                             update_date:"$upd_date",
                             update_by:"$upd_by",
            
            
        }
    },{$lookup:{
                    from:"member_provider_account",
                    localField:"_id",
                    foreignField:"memb_id",
                    as:"user_prov"
                    
            }
    
    },
            {
                    $unwind:{ path:"$user_prov" }
            },
            {
            $project:{
            _id:1,
            username:"$username",
            line_id:"$line_id",
            profile:"$profile",
            banking_account:"$banking_account",
            financial:"$financial",
            status:"$status",
            status_newmember:"$status_new_member",
            create_date:"$cr_date",
            update_date:"$upd_date",
            update_by:"$upd_by",
            //user_prov:"$user_prov.username"
            
            
        }
    },
    
    
    ])


