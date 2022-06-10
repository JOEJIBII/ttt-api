const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.get('/', controller.getrole);
    ///getuserprofile/?username=value
}