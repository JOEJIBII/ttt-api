const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/getuserprofile', controller.getdetailmember);
    ///getuserprofile/?username=value
}