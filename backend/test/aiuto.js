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

// Utenti del seed (backend/db/init/04_playlist_seed.sql).
const ALICE = { email: 'alice@waveset.test', password: 'alice-waveset' };
const BOB = { email: 'bob@waveset.test', password: 'bob-waveset' };

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
    ALICE,
    BOB,
    nuovoDevice,
    chiama,
    accedi,
    chiudi,
};
