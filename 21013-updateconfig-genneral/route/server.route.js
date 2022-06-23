const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/updateconfgenneral', controller.updateconfiggenneral);
    app.post('/', controller.updateconfiggenneral);
    ///getuserprofile/?username=value
}