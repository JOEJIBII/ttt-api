const controller = require('../controllers/server.controller')


module.exports = function(app) {
    app.post('/startgame', controller.startgame);
}