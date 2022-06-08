const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/addemployee', controller.addemp);
}