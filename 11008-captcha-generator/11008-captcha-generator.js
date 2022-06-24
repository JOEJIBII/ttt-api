
(async () =>  {
    try {
        await require('./configs/connection_mongodb')();
        await require('./configs/express')(11008)
            .then(app => require('./routes/server.route')(app))
    }catch (error) {
        console.error(error);
    }
})();