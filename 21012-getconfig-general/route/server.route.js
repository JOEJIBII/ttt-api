const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/getconfiggeneral', controller.getconfiggeneral);
    app.post('/', controller.getconfiggeneral);
    ///getuserprofile/?username=value
}