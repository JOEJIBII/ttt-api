const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/', controller.searchmember);
    ///getuserprofile/?username=value
}