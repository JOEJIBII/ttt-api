const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/historyfailed', controller.historyfailed);
    app.post('/', controller.historyfailed);
    ///getuserprofile/?username=value
}