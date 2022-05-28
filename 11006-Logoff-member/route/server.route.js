const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/logoff', controller.logoff);
    app.post('/', controller.logoff);
    ///getuserprofile/?username=value
}