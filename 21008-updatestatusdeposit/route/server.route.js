const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/updatestatusdeposit', controller.updatestatusdeposit);
    app.post('/', controller.updatestatusdeposit);
    ///getuserprofile/?username=value
}