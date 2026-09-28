// Helper condivisi dai test di integrazione (non è un file di test: il glob
// di `npm test` prende solo *.test.js). I test girano contro il backend in
// esecuzione (docker compose up): chiamate HTTP vere alle API, più una
// connessione diretta a MySQL solo per ciò che dall'esterno non si può né
// forzare né osservare.

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const path = require('node:path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mysql = require('mysql2/promise');

const URL_API = process.env.URL_API_TEST || 'http://localhost:3000/api';

// Dal Mac il database si raggiunge sulla porta esposta da Docker, non con il
// nome del servizio "mysql" usato dentro la rete di Compose.
const db = mysql.createPool({
    host: '127.0.0.1',
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Utenti del seed riservati ai test automatici (04_playlist_seed.sql e
// 09_follow_seed.sql): i test non usano mai Alice e Bob, che servono alle
// prove a mano (il test di logout-tutti, per esempio, chiuderebbe le loro
// sessioni sul telefono). UTENTE_A segue Nova Circuit (1) e Lucent Wave (3),
// UTENTE_B nessuno.
const UTENTE_A = { email: 'test-a@waveset.test', password: 'test-a-waveset' };
const UTENTE_B = { email: 'test-b@waveset.test', password: 'test-b-waveset' };

const deviceUsati = [];

function nuovoDevice() {
    const deviceId = crypto.randomUUID();
    deviceUsati.push(deviceId);
    return deviceId;
}

async function chiama(percorso, { metodo = 'GET', sessione, corpo } = {}) {
    const intestazioni = { 'Content-Type': 'application/json' };

    if (sessione) {
        intestazioni.Authorization = `Bearer ${sessione.token}`;
        intestazioni['X-Device-Id'] = sessione.deviceId;
    }

    const risposta = await fetch(`${URL_API}${percorso}`, {
        method: metodo,
        headers: intestazioni,
        body: corpo ? JSON.stringify(corpo) : undefined,
    });
    const testo = await risposta.text();

    return { stato: risposta.status, dati: testo ? JSON.parse(testo) : null };
}

async function accedi(credenziali, deviceId = nuovoDevice()) {
    const risposta = await fetch(`${URL_API}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Device-Id': deviceId,
        },
        body: JSON.stringify(credenziali),
    });

    assert.equal(risposta.status, 200, `login di ${credenziali.email}`);
    const { token, utente } = await risposta.json();

    return { token, deviceId, utente };
}

// Da chiamare in after(): cancella le sessioni create dal file di test e
// chiude la connessione al database.
async function chiudi() {
    if (deviceUsati.length > 0) {
        await db.query('DELETE FROM sessioni WHERE device_id IN (?)', [
            deviceUsati,
        ]);
    }
    await db.end();
}

module.exports = {
    URL_API,
    db,
    UTENTE_A,
    UTENTE_B,
    nuovoDevice,
    chiama,
    accedi,
    chiudi,
};
