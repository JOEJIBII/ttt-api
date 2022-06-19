const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/history', controller.history);
    app.post('/', controller.history);
    ///getuserprofile/?username=value
}