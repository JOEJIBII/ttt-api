const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/updatepushbulletsetting', controller.updatepushbulletsetting);
    app.post('/', controller.updatepushbulletsetting);
    ///getuserprofile/?username=value
}