const controller = require('../controllers/server.controller');

module.exports = function(app) {
    app.post('/updatepassword', controller.changepassword);
    app.post('/', controller.changepassword);
}