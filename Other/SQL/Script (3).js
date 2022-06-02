db.getCollection("agent").insertOne({ 
      "name":"banpong888",
      "description":"",
      "prefix":"bp888",
      "domain_name":"https://www.banpong888.com",
      "member":{
          "running_number":100033,
      } ,
      "provider":{
          "prov_id":ObjectId("62801181e6e7328a76381719"),
          "provider_name":"amb",
          "prov_key":"KGq54x_Hx6UUwxku4gT-q",
          "prov_prefix":"62691ABB5677C1A2BE582A44",
          "prov_domain":"https://api.ambexapi.com/api/v1/",
          "prov_agentusername":"99dev",
          "prov_whitelabel":"gb711"
      },
      "game":{
          
      },
      "deposit":{},
      "deposit_config":[{
          "max_cash_limit":10,
          "min_cash_limit":1,
      }],
      "withdraw":{},
      "withdraw_config":[{
          "counter":5,
          "max_cash_limit":10,
          "min_cash_limit":1,
      }],
      "member_websit":{
          
      },
      "panel_websit":[{
          "panel_name":"",
          "panel_domain":""
      }],
      "status":"Active",
      "cr_by":"manual",
      "cr_date":"",
      "cr_prog":"",
      "upd_by":"",
      "upd_date":"",
      "upd_prog":""    
})

//db.getCollection("member_provider_account").aggregate([{
//    $match:{
//        $and:{_id:ObjectId("62820fb1136bc3d37930e439")}
//    }
//}])
