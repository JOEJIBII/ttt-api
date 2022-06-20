const controller = require("../controllers/server.controller");
const fetch = require('node-fetch');
module.exports = app =>{

    app.get("/:module/:route", controller);
    app.head("/:module/:route", controller);
    app.post("/:module/:route", controller);
    app.put("/:module/:route", controller);
    app.patch("/:module/:route", controller);

}