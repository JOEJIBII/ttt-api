const controller = require('../controllers/server.controller')

module.exports = function(app) {
    app.post('/updatebankautotranfer', controller.updatebankautotranfer);
    app.post('/', controller.updatebankautotranfer);
    ///getuserprofile/?username=value
}