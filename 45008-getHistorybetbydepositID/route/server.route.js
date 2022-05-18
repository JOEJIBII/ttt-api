const controller = require('../controllers/server.controller')


module.exports = function(app) {
    app.post('/getHistorybetbydepositID', controller.getHistorybetbydepositID);
}