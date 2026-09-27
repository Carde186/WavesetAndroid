// Gestione degli errori dopo il passaggio a Express 5 (vedi
// src/gestisciErrore.js). Il caso "database non raggiungibile" non è qui:
// richiede di fermare il container MySQL, ed è verificato a mano.

const assert = require('node:assert/strict');
const { describe, test } = require('node:test');

const URL_API = process.env.URL_API_TEST || 'http://localhost:3000/api';
const DEVICE_ID = '44444444-4444-4444-8444-444444444444';

describe('errori delle richieste', () => {
    test('login senza corpo: 400, non 500', async () => {
        const risposta = await fetch(`${URL_API}/auth/login`, {
            method: 'POST',
            headers: { 'X-Device-Id': DEVICE_ID },
        });

        assert.equal(risposta.status, 400);
    });

    test('JSON malformato: 400 in JSON, senza dettagli interni', async () => {
        const risposta = await fetch(`${URL_API}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Device-Id': DEVICE_ID,
            },
            body: '{"email": ',
        });

        assert.equal(risposta.status, 400);
        assert.deepEqual(await risposta.json(), {
            messaggio: 'Richiesta non valida',
        });
    });

    test('URL inesistente: 404, non 401 né 500', async () => {
        const risposta = await fetch(`${URL_API}/inesistente`);

        assert.equal(risposta.status, 404);
    });
});
