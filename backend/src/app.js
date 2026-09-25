const express = require('express');

const routeAlbum = require('./routes/album');
const routeArtisti = require('./routes/artisti');
const routeBrani = require('./routes/brani');
const routeGeneri = require('./routes/generi');
const routePlaylist = require('./routes/playlist');
const routeSalute = require('./routes/salute');

function creaApp() {
    const app = express();

    app.use(express.json());
    app.use(routeSalute);
    app.use('/api', routeGeneri);
    app.use('/api', routeArtisti);
    app.use('/api', routeBrani);
    app.use('/api', routeAlbum);
    app.use('/api', routePlaylist);

    return app;
}

module.exports = creaApp;
