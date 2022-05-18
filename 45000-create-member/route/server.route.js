const controller = require('../controllers/server.controller')


module.exports = function(app) {
    app.post('/registermemberPD', controller.registermember);
}