(async () => {
    const PORT = "61001";
    await Promise.all([await require("./build/mongodb")(), await require("./build/express")()])
        .then(([, app]) => (require("./controllers/server.controller")(), app))
        .then(app => app.listen(PORT))
        .then(() => console.log(`server is running at ${PORT}`))
        .catch(error => console.error(error));
})();

// (async () => {
//     await require("./build/express")()
//         .then(() => console.log("Server is runing"))
//         .then(app => (require("./controllers/server.controller")(), app))
//         .catch(error => console.error(error));
// })();