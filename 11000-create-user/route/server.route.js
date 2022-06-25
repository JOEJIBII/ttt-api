const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/register', controller.registermember);
    app.post('/', controller.registermember);
}