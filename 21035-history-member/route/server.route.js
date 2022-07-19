const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/historymember', controller.historymember);
    app.post('/', controller.historymember);
    ///getuserprofile/?username=value
}