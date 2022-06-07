const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/', controller.getbankdeposit);
    ///getuserprofile/?username=value
}