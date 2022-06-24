const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/historylasted', controller.historylasted);
    app.post('/', controller.historylasted);
    ///getuserprofile/?username=value
}