const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/', controller.getallemployee);
    ///getuserprofile/?username=value
}