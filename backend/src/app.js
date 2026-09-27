const express = require('express');

const richiediAutenticazione = require('./autenticazione/richiediAutenticazione');
const gestisciErrore = require('./gestisciErrore');
const routeAlbum = require('./routes/album');
const routeArtisti = require('./routes/artisti');
const routeAutenticazione = require('./routes/autenticazione');
const routeBrani = require('./routes/brani');
const routeGeneri = require('./routes/generi');
const routePlaylist = require('./routes/playlist');
const routeRicerca = require('./routes/ricerca');
const routeSalute = require('./routes/salute');

function creaApp() {
    const app = express();

    app.use(express.json());
    app.use(routeSalute);
    app.use('/api', routeGeneri);
    app.use('/api', routeArtisti);
    app.use('/api', routeBrani);
    app.use('/api', routeAlbum);
    app.use('/api', routeRicerca);
    app.use('/api/auth', routeAutenticazione);
    // Middleware montato solo su /api/playlist: su '/api' intercetterebbe
    // anche gli URL inesistenti del catalogo (401 al posto di 404).
    app.use('/api/playlist', richiediAutenticazione, routePlaylist);

    // Sempre per ultimo, dopo tutte le route.
    app.use(gestisciErrore);

    return app;
}

module.exports = creaApp;
