const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/updateemp', controller.updateemp);
    app.post('/', controller.updateemp);
    ///getuserprofile/?username=value
}