const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/returnwinloss', controller.returnwinloss);
    app.post('/', controller.returnwinloss);
    ///getuserprofile/?username=value
}