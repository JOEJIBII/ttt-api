const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
const GATEWAY_API_PORT = require("../constants/api-port-list");

module.exports.get = headers => {
    return new Promise((resolve, reject) => {
        try {
            let bearer = headers.authorization || headers.Authorization;
            (bearer && bearer.substring(0, 6) === "Bearer") ? resolve(bearer.substring(7)) : resolve(null);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.decode = token => {
    return new Promise((resolve, reject) => {
        try {
            resolve(jwt.decode(token));
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.verify = (token, sKey) => {

    return new Promise(async (resolve, reject) => {
        try {
            jwt.verify(token, sKey, error => {
                !error ? resolve({ status: true }) : resolve({ status: false, error: error.name });
            });
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.send = (request, payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { method, params, headers, body, query } = request;
            let { module, route } = params;
            headers["payload"] = JSON.stringify(payload);
            let uQuery = (method !== "POST") ? "?" + Object.keys(query).map(e => e + "=" + query[e]).join("&") : "";
            let option = (method === "GET" || method === "HEAD" || method === "DELETE") ? { method: method, headers: headers } : { method: method, headers: headers, body: JSON.stringify(body) }
            await fetch("http://localhost" + ":" + GATEWAY_API_PORT[module][route] + uQuery, option)
                .then(async response => await response.json())
                .then(result => resolve(result))
                .catch(error => reject(error));
        } catch (error) {
            reject(error);
        }
    });
}