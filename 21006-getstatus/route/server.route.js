const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/getstatus', controller.getstatus);
    app.post('/', controller.getstatus);
    ///getuserprofile/?username=value
}