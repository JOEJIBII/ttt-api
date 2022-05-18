const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/getbanking', controller.getbanking);
    ///getuserprofile/?username=value
}