const { MongoClient, ObjectId } = require('mongodb');
const { CONNECTION, DB } = {
    CONNECTION: 'mongodb+srv://SA:mh4MJHcnXGtCq7bv@cluster0.wnaus.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    DB: 'teatrueteam-staging'
};

module.exports = () => {
    return new Promise(async (resolve, reject) => {
        MongoClient.connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(dbs => (module.exports.MongoDB = dbs.db(DB), dbs))
            .then(dbs => resolve(dbs))
            .catch(error => reject(error));
    });
}