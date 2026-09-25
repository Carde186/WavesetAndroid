const express = require('express');

const pool = require('../config/database');

const router = express.Router();

async function elencaArtisti(req, res) {
    const { genere_id: genereId } = req.query;

    if (genereId) {
        const [righe] = await pool.query(
            `SELECT DISTINCT a.id, a.nome, a.immagine_url
             FROM artista a
             INNER JOIN artista_genere ag ON ag.artista_id = a.id
             WHERE ag.genere_id = ?
             ORDER BY a.nome`,
            [genereId],
        );
        res.json(righe);
        return;
    }

    const [righe] = await pool.query(
        'SELECT id, nome, immagine_url FROM artista ORDER BY nome',
    );
    res.json(righe);
}

async function dettaglioArtista(req, res) {
    const { id } = req.params;

    const [righeArtista] = await pool.query(
        'SELECT id, nome, bio, immagine_url FROM artista WHERE id = ?',
        [id],
    );

    if (righeArtista.length === 0) {
        res.status(404).json({ messaggio: 'Artista non trovato' });
        return;
    }

    const [generi] = await pool.query(
        `SELECT g.id, g.nome
         FROM genere g
         INNER JOIN artista_genere ag ON ag.genere_id = g.id
         WHERE ag.artista_id = ?
         ORDER BY g.nome`,
        [id],
    );

    const [brani] = await pool.query(
        `SELECT id, titolo, album_id, data_pubblicazione, url_spotify
         FROM brano
         WHERE artista_id = ?
         ORDER BY data_pubblicazione DESC`,
        [id],
    );

    const [album] = await pool.query(
        `SELECT id, titolo, data_pubblicazione
         FROM album
         WHERE artista_id = ?
         ORDER BY data_pubblicazione DESC`,
        [id],
    );

    res.json({ ...righeArtista[0], generi, brani, album });
}

router.get('/artisti', elencaArtisti);
router.get('/artisti/:id', dettaglioArtista);

module.exports = router;
