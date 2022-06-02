(async () => {
    await require("./build/express")()
        .then(() => console.log("Server is runing"))
        .then(app => (require("./controllers/server.controller")(), app))
        .catch(error => console.error(error));
})();