const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/updatemember', controller.updateprofile);
    app.post('/', controller.updateprofile);
    ///getuserprofile/?username=value
}