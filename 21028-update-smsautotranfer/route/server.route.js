const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/updatesmsautotranfer', controller.updatesmsautotranfer);
    app.post('/', controller.updatesmsautotranfer);
    ///getuserprofile/?username=value
}