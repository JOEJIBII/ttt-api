const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/getprefix', controller.getprefix);
    app.post('/', controller.getprefix);
    ///getuserprofile/?username=value
}