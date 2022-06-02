db.getCollection("CONFIGURATION").findOneAndUpdate(
                {
                    $macth:{
                        domain_name : body.web_prefix
                    }
                        
                },
               {
                    $inc:{
                        "member.running_number":1
                    }  
               },
               {
                    $project:{
                            _id:0
                    }
               }
            
            );