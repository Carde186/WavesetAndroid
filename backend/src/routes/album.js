const express = require('express');

const pool = require('../config/database');

const router = express.Router();

async function dettaglioAlbum(req, res) {
    const { id } = req.params;

    const [righeAlbum] = await pool.query(
        `SELECT al.id, al.titolo, al.data_pubblicazione, al.copertina_url,
                a.id AS artista_id, a.nome AS artista_nome, a.immagine_url AS artista_immagine_url
         FROM album al
         INNER JOIN artista a ON a.id = al.artista_id
         WHERE al.id = ?`,
        [id],
    );

    if (righeAlbum.length === 0) {
        res.status(404).json({ messaggio: 'Album non trovato' });
        return;
    }

    const [brani] = await pool.query(
        `SELECT id, titolo, data_pubblicazione, url_spotify
         FROM brano
         WHERE album_id = ?
         ORDER BY data_pubblicazione ASC`,
        [id],
    );

    const album = righeAlbum[0];

    res.json({
        id: album.id,
        titolo: album.titolo,
        dataPubblicazione: album.data_pubblicazione,
        copertinaUrl: album.copertina_url,
        artista: {
            id: album.artista_id,
            nome: album.artista_nome,
            immagineUrl: album.artista_immagine_url,
        },
        brani,
    });
}

router.get('/album/:id', dettaglioAlbum);

module.exports = router;
