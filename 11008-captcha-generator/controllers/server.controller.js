const _ = require("lodash");
const captcha = require("nodejs-captcha");
const model = require("../models/server.model");

module.exports.get = async (request, response) => {
    try {
        const nCaptcha = captcha();
        const image = nCaptcha["image"];
        const value = nCaptcha["value"];
        const captchaID = (await model.insert(image, value))["insertedId"];
        response.send({ status: "200", message: "success", result: { image, captchaID } }).end();
    } catch (error) {
        response.send({ status: "500", message: "internal server error" }).end();
    }
}

module.exports.verify = async (request, response) => {
    try {
        const { body } = request;
        const { captchaID, value } = body;
        if (!_.isEmpty(captchaID) && !_.isEmpty(value)) {
            console.log(captchaID)
            let result = await model.get(captchaID);
            if (_.isEqual(result["value"], value)) {
                await model.remove(captchaID);
                
                response.send({ status: "200", message: "success" }).end();
            } else {
               
                response.send({ status: "300", message: "wrong captcha" }).end();
            }
        } else {
            response.send({ status: "100", message: "invalid parameter" }).end();
        }
    } catch (error) {
        response.send({ status: "500", message: "internal server error" }).end();
    }
}