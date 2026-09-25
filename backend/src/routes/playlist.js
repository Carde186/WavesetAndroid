const express = require('express');

const pool = require('../config/database');
const ID_UTENTE_FITTIZIO = require('../config/utenteFittizio');

const router = express.Router();

// Verifica che la playlist esista E appartenga all'utente: questo controllo
// (utente_id = ?) è già il meccanismo di isolamento tra utenti. Quando lo
// step Autenticazione sostituirà ID_UTENTE_FITTIZIO con l'id preso dal JWT,
// nessun'altra modifica sarà necessaria per impedire a un utente di vedere o
// modificare le playlist di un altro.
async function trovaPlaylistDiUtente(playlistId, utenteId) {
    const [righe] = await pool.query(
        'SELECT id, nome FROM playlist WHERE id = ? AND utente_id = ?',
        [playlistId, utenteId],
    );

    return righe[0] ?? null;
}

async function elencaPlaylist(req, res) {
    const [righe] = await pool.query(
        'SELECT id, nome FROM playlist WHERE utente_id = ? ORDER BY id',
        [ID_UTENTE_FITTIZIO],
    );

    res.json(righe);
}

async function creaPlaylist(req, res) {
    const { nome } = req.body;

    if (!nome) {
        res.status(400).json({ messaggio: 'nome obbligatorio' });
        return;
    }

    const [risultato] = await pool.query(
        'INSERT INTO playlist (nome, utente_id) VALUES (?, ?)',
        [nome, ID_UTENTE_FITTIZIO],
    );

    res.status(201).json({ id: risultato.insertId, nome });
}

async function dettaglioPlaylist(req, res) {
    const { id } = req.params;

    const playlist = await trovaPlaylistDiUtente(id, ID_UTENTE_FITTIZIO);

    if (!playlist) {
        res.status(404).json({ messaggio: 'Playlist non trovata' });
        return;
    }

    const [brani] = await pool.query(
        `SELECT b.id, b.titolo, b.url_spotify, a.nome AS artista_nome, pb.aggiunto_il
         FROM playlist_brano pb
         INNER JOIN brano b ON b.id = pb.brano_id
         INNER JOIN artista a ON a.id = b.artista_id
         WHERE pb.playlist_id = ?
         ORDER BY pb.aggiunto_il ASC`,
        [playlist.id],
    );

    res.json({ ...playlist, brani });
}

async function rinominaPlaylist(req, res) {
    const { id } = req.params;
    const { nome } = req.body;

    if (!nome) {
        res.status(400).json({ messaggio: 'nome obbligatorio' });
        return;
    }

    const playlist = await trovaPlaylistDiUtente(id, ID_UTENTE_FITTIZIO);

    if (!playlist) {
        res.status(404).json({ messaggio: 'Playlist non trovata' });
        return;
    }

    await pool.query('UPDATE playlist SET nome = ? WHERE id = ?', [nome, id]);

    res.json({ id: playlist.id, nome });
}

async function eliminaPlaylist(req, res) {
    const { id } = req.params;

    const playlist = await trovaPlaylistDiUtente(id, ID_UTENTE_FITTIZIO);

    if (!playlist) {
        res.status(404).json({ messaggio: 'Playlist non trovata' });
        return;
    }

    await pool.query('DELETE FROM playlist WHERE id = ?', [id]);

    res.json({ messaggio: 'Playlist eliminata' });
}

async function aggiungiBrano(req, res) {
    const { id } = req.params;
    const { branoId } = req.body;

    if (!branoId) {
        res.status(400).json({ messaggio: 'branoId obbligatorio' });
        return;
    }

    const playlist = await trovaPlaylistDiUtente(id, ID_UTENTE_FITTIZIO);

    if (!playlist) {
        res.status(404).json({ messaggio: 'Playlist non trovata' });
        return;
    }

    await pool.query(
        'INSERT IGNORE INTO playlist_brano (playlist_id, brano_id) VALUES (?, ?)',
        [id, branoId],
    );

    res.status(201).json({ messaggio: 'Brano aggiunto alla playlist' });
}

async function rimuoviBrano(req, res) {
    const { id, branoId } = req.params;

    const playlist = await trovaPlaylistDiUtente(id, ID_UTENTE_FITTIZIO);

    if (!playlist) {
        res.status(404).json({ messaggio: 'Playlist non trovata' });
        return;
    }

    await pool.query(
        'DELETE FROM playlist_brano WHERE playlist_id = ? AND brano_id = ?',
        [id, branoId],
    );

    res.json({ messaggio: 'Brano rimosso dalla playlist' });
}

router.get('/playlist', elencaPlaylist);
router.post('/playlist', creaPlaylist);
router.get('/playlist/:id', dettaglioPlaylist);
router.put('/playlist/:id', rinominaPlaylist);
router.delete('/playlist/:id', eliminaPlaylist);
router.post('/playlist/:id/brani', aggiungiBrano);
router.delete('/playlist/:id/brani/:branoId', rimuoviBrano);

module.exports = router;
