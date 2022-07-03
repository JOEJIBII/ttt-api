const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/updateconfgenneral', controller.insertbanking);
    app.post('/', controller.insertbanking);
    ///getuserprofile/?username=value
}