const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/deposit', controller.deposit);
    app.post('/', controller.deposit);
    ///getuserprofile/?username=value
}