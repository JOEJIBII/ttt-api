db.getCollection('agent').aggregate([
                {
                    $match : {
                        $and : [
                            //{ou_id : ObjectId(payload.ou)},
                          //{branch_id : ObjectId(payload.branch)},
                            {
                                _id : ObjectId("62931c84136bc3d37930e43b")
                            }

                        ]
                    }
                },
                {
                $unwind:{ path:"$withdraw_config" }
                  },
                {
                    $project:{
                            id:1,
                            //withdraw_config:"$withdraw_config",
                            counter:"$withdraw_config.counter",
                            min:"$withdraw_config.min_cash_limit",
                            max:"$withdraw_config.max_cash_limit"
                            
                    }
                },
                 
           
                
            ])