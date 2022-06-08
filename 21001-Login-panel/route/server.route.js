const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/login', controller.login);
    //app.post('/', controller.login);
    ///getuserprofile/?username=value
}