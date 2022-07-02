const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/', controller.getallbanksetting);
    ///getuserprofile/?username=value
}