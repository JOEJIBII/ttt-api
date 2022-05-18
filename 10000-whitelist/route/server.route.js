const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/whitelist', controller.checkagent);
    ///getuserprofile/?username=value
}