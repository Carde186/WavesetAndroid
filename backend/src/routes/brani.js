const express = require('express');

const pool = require('../config/database');

const router = express.Router();

const LIMITE_RECENTI = 10;

// Oggi restituisce semplicemente i brani più recenti del catalogo — non
// filtrati per "artisti seguiti" perché quel concetto non esiste ancora
// (arriva con l'Autenticazione). La sezione "Novità" del frontend userà
// questo stesso endpoint; quando l'Autenticazione sarà pronta, qui si
// aggiungerà un filtro per utente, senza cambiare la forma della risposta.
async function elencaRecenti(req, res) {
    const [righe] = await pool.query(
        `SELECT b.id, b.titolo, b.data_pubblicazione, b.url_spotify,
                a.id AS artista_id, a.nome AS artista_nome, a.immagine_url AS artista_immagine_url,
                al.id AS album_id, al.titolo AS album_titolo, al.copertina_url AS album_copertina_url
         FROM brano b
         INNER JOIN artista a ON a.id = b.artista_id
         LEFT JOIN album al ON al.id = b.album_id
         ORDER BY b.data_pubblicazione DESC
         LIMIT ?`,
        [LIMITE_RECENTI],
    );

    res.json(righe.map(formattaBrano));
}

async function dettaglioBrano(req, res) {
    const { id } = req.params;

    const [righe] = await pool.query(
        `SELECT b.id, b.titolo, b.data_pubblicazione, b.url_spotify,
                a.id AS artista_id, a.nome AS artista_nome, a.immagine_url AS artista_immagine_url,
                al.id AS album_id, al.titolo AS album_titolo, al.copertina_url AS album_copertina_url
         FROM brano b
         INNER JOIN artista a ON a.id = b.artista_id
         LEFT JOIN album al ON al.id = b.album_id
         WHERE b.id = ?`,
        [id],
    );

    if (righe.length === 0) {
        res.status(404).json({ messaggio: 'Brano non trovato' });
        return;
    }

    res.json(formattaBrano(righe[0]));
}

function formattaBrano(brano) {
    return {
        id: brano.id,
        titolo: brano.titolo,
        dataPubblicazione: brano.data_pubblicazione,
        urlSpotify: brano.url_spotify,
        artista: {
            id: brano.artista_id,
            nome: brano.artista_nome,
            immagineUrl: brano.artista_immagine_url,
        },
        album: brano.album_id
            ? {
                  id: brano.album_id,
                  titolo: brano.album_titolo,
                  copertinaUrl: brano.album_copertina_url,
              }
            : null,
    };
}

router.get('/brani/recenti', elencaRecenti);
router.get('/brani/:id', dettaglioBrano);

module.exports = router;
