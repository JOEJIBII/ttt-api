const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/', controller.getallbanksauto);
  //  app.post('/', controller.updatestopauto);
    ///getuserprofile/?username=value
}