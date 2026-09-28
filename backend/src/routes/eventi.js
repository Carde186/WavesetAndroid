const express = require('express');

const autenticazioneFacoltativa = require('../autenticazione/autenticazioneFacoltativa');
const pool = require('../config/database');

const router = express.Router();

// mysql2 restituisce le colonne DECIMAL come stringhe (per non perdere
// precisione): la mappa vuole numeri. null resta null (evento senza
// coordinate, es. inserito a mano senza geocodifica).
function numeroONull(valore) {
    return valore === null ? null : Number(valore);
}

// Lineup di più eventi con una sola query (invece di una per evento),
// raggruppato per evento_id. Ordine alfabetico: il lineup non ha ruoli in v1
// (niente headliner), quindi il "primo artista" usato dal marker è il primo
// in ordine di nome, sempre lo stesso.
async function lineupPerEvento(idEventi) {
    const lineup = new Map(idEventi.map(id => [id, []]));

    if (idEventi.length === 0) {
        return lineup;
    }

    const [righe] = await pool.query(
        `SELECT ea.evento_id, a.id, a.nome, a.immagine_url
         FROM evento_artista ea
         INNER JOIN artista a ON a.id = ea.artista_id
         WHERE ea.evento_id IN (?)
         ORDER BY a.nome`,
        [idEventi],
    );

    for (const riga of righe) {
        lineup.get(riga.evento_id).push({
            id: riga.id,
            nome: riga.nome,
            immagine_url: riga.immagine_url,
        });
    }

    return lineup;
}

function formattaEvento(evento, lineup) {
    return {
        id: evento.id,
        titolo: evento.titolo,
        data_evento: evento.data_evento,
        ora_evento: evento.ora_evento,
        luogo: evento.luogo,
        citta: evento.citta,
        latitudine: numeroONull(evento.latitudine),
        longitudine: numeroONull(evento.longitudine),
        lineup,
    };
}

const COLONNE_EVENTO = `e.id, e.titolo, e.data_evento, e.ora_evento, e.luogo,
    e.citta, e.latitudine, e.longitudine`;

// Eventi futuri (da oggi in poi), per data e ora. filtro=seguiti: solo
// quelli con almeno un artista seguito in lineup, e richiede la sessione.
async function elencaEventi(req, res) {
    const filtro = req.query.filtro ?? 'tutti';

    if (filtro !== 'tutti' && filtro !== 'seguiti') {
        res.status(400).json({
            messaggio: 'filtro deve essere tutti o seguiti',
        });
        return;
    }

    if (filtro === 'seguiti' && !req.utente) {
        res.status(401).json({ messaggio: 'Sessione non valida' });
        return;
    }

    const [eventi] =
        filtro === 'seguiti'
            ? await pool.query(
                  `SELECT ${COLONNE_EVENTO}
                   FROM evento e
                   WHERE e.data_evento >= CURDATE()
                     AND EXISTS (
                         SELECT 1
                         FROM evento_artista ea
                         INNER JOIN utente_artista ua
                             ON ua.artista_id = ea.artista_id
                         WHERE ea.evento_id = e.id AND ua.utente_id = ?
                     )
                   ORDER BY e.data_evento, e.ora_evento`,
                  [req.utente.id],
              )
            : await pool.query(
                  `SELECT ${COLONNE_EVENTO}
                   FROM evento e
                   WHERE e.data_evento >= CURDATE()
                   ORDER BY e.data_evento, e.ora_evento`,
              );

    const lineup = await lineupPerEvento(eventi.map(e => e.id));

    res.json(eventi.map(e => formattaEvento(e, lineup.get(e.id))));
}

async function dettaglioEvento(req, res) {
    const [righe] = await pool.query(
        `SELECT ${COLONNE_EVENTO} FROM evento e WHERE e.id = ?`,
        [req.params.id],
    );

    if (righe.length === 0) {
        res.status(404).json({ messaggio: 'Evento non trovato' });
        return;
    }

    const lineup = await lineupPerEvento([righe[0].id]);

    res.json(formattaEvento(righe[0], lineup.get(righe[0].id)));
}

router.get('/eventi', autenticazioneFacoltativa, elencaEventi);
router.get('/eventi/:id', dettaglioEvento);

module.exports = router;
