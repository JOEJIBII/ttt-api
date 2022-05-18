const controller = require('../controllers/server.controller');

module.exports = function(app) {
    app.get('/updatepassword', controller.changepasswordmember);
}