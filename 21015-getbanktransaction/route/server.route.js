const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/', controller.getbanktrnsaction);
    ///getuserprofile/?username=value
}