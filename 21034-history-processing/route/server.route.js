const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/historyprocessing', controller.historyprocessing);
    app.post('/', controller.historyprocessing);
    ///getuserprofile/?username=value
}