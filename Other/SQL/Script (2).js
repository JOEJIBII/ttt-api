db.getCollection("agent").aggregate([
                {
                    $match : {
                        $and : [
                            //{ou_id : ObjectId(payload.ou)},
                          //{branch_id : ObjectId(payload.branch)},
                            { 
                                domain_name : "https://www.banpong888.com"
                            }

                        ]
                    }
                },
                {
                    $project:{
                        _id:1,
                          provider_id:"$provider.prov_id",
                          provider_name:"$provider.provider_name",
                          provider_key:"$provider.prov_key",
                          provider_prefix:"$provider.prov_prefix",
                          provider_domain:"$provider.prov_domain",
                          provider_agentusername:"$provider.prov_agentusername",
                          provider_whitelabel:"$provider.prov_whitelabel",
                    }
                }
                
            ])


