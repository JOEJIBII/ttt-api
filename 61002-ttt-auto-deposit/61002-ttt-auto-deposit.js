(async () => {
    await Promise.all([await require('./build/mongodb')(), await require('./build/express')()])
        .then(([, app]) => (require('./controllers/server.controller')(), app))
        .catch(error => console.error(error));
})();