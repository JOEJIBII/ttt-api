(async () => {
    const PORT = "10000";
    await Promise.all([await require("./build/mongodb")(), await require("./build/express")()])
        .then(([, app]) => (require("./controllers/server.controller")(), app))
        .then(app => app.listen(PORT))
        .then(() => console.log(`server is running at ${PORT}`))
        .catch(error => console.error(error));
})();