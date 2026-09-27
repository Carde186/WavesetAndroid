const pool = require('../config/database');
const { deviceIdValido, tokenCorrisponde } = require('./token');

// Stessa risposta per ogni motivo di rifiuto (token mancante, sbagliato,
// scaduto, device_id che non combacia): il client non deve poter capire
// quale controllo è fallito.
function rifiuta(res) {
    res.status(401).json({ messaggio: 'Sessione non valida' });
}

// Nessun try/catch: con Express 5 un errore del database arriva da solo a
// gestisciErrore (vedi app.js).
async function richiediAutenticazione(req, res, next) {
    const [schema, token] = (req.get('Authorization') || '').split(' ');
    const deviceId = req.get('X-Device-Id');

    if (schema !== 'Bearer' || !token || !deviceIdValido(deviceId)) {
        rifiuta(res);
        return;
    }

    // La riga si cerca per device_id (non segreto); il token si confronta
    // dopo, in Node, a tempo costante.
    const [righe] = await pool.query(
        `SELECT s.id, s.utente_id, s.hash_token, s.scadenza > NOW() AS valida,
                u.ruolo
         FROM sessioni s
         INNER JOIN utente u ON u.id = s.utente_id
         WHERE s.device_id = ?`,
        [deviceId],
    );

    const sessione = righe[0];

    if (!sessione || !tokenCorrisponde(token, sessione.hash_token)) {
        rifiuta(res);
        return;
    }

    // La scadenza si controlla solo dopo aver verificato il token: così
    // chi non ha il token non può far cancellare la sessione altrui.
    if (!sessione.valida) {
        await pool.query('DELETE FROM sessioni WHERE id = ?', [sessione.id]);
        rifiuta(res);
        return;
    }

    req.utente = { id: sessione.utente_id, ruolo: sessione.ruolo };
    req.sessioneId = sessione.id;
    next();
}

module.exports = richiediAutenticazione;
