const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/historybyId', controller.historybyId);
    app.post('/', controller.historybyId);
    ///getuserprofile/?username=value
}