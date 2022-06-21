const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/getdeposithistory', controller.getdeposithistory);
    app.post('/', controller.getdeposithistory);
    ///getuserprofile/?username=value
}