const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/getprivilege', controller.getprivilege);
    app.post('/', controller.getprivilege);
    ///getuserprofile/?username=value
}