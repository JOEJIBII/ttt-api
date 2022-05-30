const controller = require("../controllers/server.controller");
module.exports = app => {
    app.get("/", controller["get"]);
    app.post("/", controller["verify"]);
}