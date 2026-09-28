const express = require('express');

const autenticazioneFacoltativa = require('../autenticazione/autenticazioneFacoltativa');
const pool = require('../config/database');
const formattaBrano = require('../utilita/formattaBrano');

const router = express.Router();

const LIMITE_RECENTI = 10;

const SELECT_BRANO = `SELECT b.id, b.titolo, b.data_pubblicazione, b.url_spotify,
            a.id AS artista_id, a.nome AS artista_nome, a.immagine_url AS artista_immagine_url,
            al.id AS album_id, al.titolo AS album_titolo, al.copertina_url AS album_copertina_url
     FROM brano b
     INNER JOIN artista a ON a.id = b.artista_id
     LEFT JOIN album al ON al.id = b.album_id`;

// Feed "Novità" della Home. Con una sessione e almeno un artista seguito
// che ha dei brani: i brani più recenti di quegli artisti
// (personalizzato: true). Altrimenti (anonimi, chi non segue nessuno, chi
// segue solo artisti senza brani) le ultime uscite di tutto il catalogo:
// per i brani non esiste un dato di popolarità, quindi il fallback è per
// data. "personalizzato" serve all'app per scegliere il titolo della
// sezione.
async function elencaRecenti(req, res) {
    if (req.utente) {
        const [seguiti] = await pool.query(
            `${SELECT_BRANO}
             INNER JOIN utente_artista ua ON ua.artista_id = b.artista_id
             WHERE ua.utente_id = ?
             ORDER BY b.data_pubblicazione DESC
             LIMIT ?`,
            [req.utente.id, LIMITE_RECENTI],
        );

        if (seguiti.length > 0) {
            res.json({
                personalizzato: true,
                brani: seguiti.map(formattaBrano),
            });
            return;
        }
    }

    const [righe] = await pool.query(
        `${SELECT_BRANO}
         ORDER BY b.data_pubblicazione DESC
         LIMIT ?`,
        [LIMITE_RECENTI],
    );

    res.json({ personalizzato: false, brani: righe.map(formattaBrano) });
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

router.get('/brani/recenti', autenticazioneFacoltativa, elencaRecenti);
router.get('/brani/:id', dettaglioBrano);

module.exports = router;
