const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/banktransaction', controller.banktransaction);
    app.post('/', controller.banktransaction);
    ///getuserprofile/?username=value
}