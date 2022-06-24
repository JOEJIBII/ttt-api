const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/updatetransaction', controller.updatetransaction);
    app.post('/', controller.updatetransaction);
    ///getuserprofile/?username=value
}