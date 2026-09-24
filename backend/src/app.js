const express = require('express');

const routeSalute = require('./routes/salute');

function creaApp() {
    const app = express();

    app.use(express.json());
    app.use(routeSalute);

    return app;
}

module.exports = creaApp;
