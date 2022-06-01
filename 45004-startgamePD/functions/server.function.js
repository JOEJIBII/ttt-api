

    module.exports.Mappingdata = async (result,tab) => {
        return new Promise(async (resolve) => {
            //let memb = member
            console.log("member",memb)
            if(tab === "Sports"){
                url = result.result.url
                
            }else{
                url = result.result.data.uri
                
            }
            resolve({
                uri : url
            },
            )
        })
        }