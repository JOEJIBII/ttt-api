// (async () => {
//     const PORT = "2901";
//     await Promise.all([await require("./configs/mongodb")(), await require("./configs/express")()])
//         .then(([db, app]) => (require("./routes/server.route")(app), app))
//         .then(app => app.listen(PORT))
//         .then(() => console.log(`server is running at ${PORT}`))
//         .catch(error => console.error(error));
// })();

(async () =>  {
    try {
        await require('./configs/connection_mongodb')();
        await require('./configs/express')(11008)
            .then(app => require('./routes/server.route')(app))
    }catch (error) {
        console.error(error);
    }
})();