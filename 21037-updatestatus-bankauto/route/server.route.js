const controller = require('../controllers/server.controller')

module.exports = function(app) {
   // app.post('/', controller.getallbanksauto);
    app.post('/', controller.updatestatusauto);
    ///getuserprofile/?username=value
}