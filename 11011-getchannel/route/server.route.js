const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/getchannel', controller.getchannel);
    app.post('/', controller.getchannel);
    ///getuserprofile/?username=value
}