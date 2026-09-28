// Autenticazione: login, middleware, sessioni e isolamento tra due utenti
// reali sulle playlist. Avvio: npm test (con i container attivi).

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { after, before, describe, test } = require('node:test');

const {
    URL_API,
    db,
    ALICE,
    BOB,
    nuovoDevice,
    chiama,
    accedi,
    chiudi,
} = require('./aiuto');

after(chiudi);

describe('login', () => {
    test('credenziali corrette: token di 256 bit e dati utente', async () => {
        const sessione = await accedi(ALICE);

        assert.match(sessione.token, /^[0-9a-f]{64}$/);
        assert.deepEqual(sessione.utente, {
            id: 1,
            nome: 'Alice',
            email: ALICE.email,
            ruolo: 'USER',
        });
    });

    test('password sbagliata ed email inesistente: stessa risposta', async () => {
        const deviceId = nuovoDevice();
        const prova = credenziali =>
            fetch(`${URL_API}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Device-Id': deviceId,
                },
                body: JSON.stringify(credenziali),
            });

        const sbagliata = await prova({ ...ALICE, password: 'sbagliata' });
        const inesistente = await prova({
            email: 'nessuno@waveset.test',
            password: 'qualunque',
        });

        assert.equal(sbagliata.status, 401);
        assert.equal(inesistente.status, 401);
        assert.deepEqual(await sbagliata.json(), await inesistente.json());
    });

    test('senza X-Device-Id il login è rifiutato', async () => {
        const risposta = await fetch(`${URL_API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ALICE),
        });

        assert.equal(risposta.status, 400);
    });

    test('il token non è salvato in chiaro, solo il suo SHA-256', async () => {
        const sessione = await accedi(ALICE);
        const [righe] = await db.query(
            'SELECT hash_token FROM sessioni WHERE device_id = ?',
            [sessione.deviceId],
        );
        const sha256 = crypto
            .createHash('sha256')
            .update(sessione.token)
            .digest('hex');

        assert.notEqual(righe[0].hash_token, sessione.token);
        assert.equal(righe[0].hash_token, sha256);
    });
});

describe('middleware sulle route protette', () => {
    test('senza token: 401', async () => {
        assert.equal((await chiama('/playlist')).stato, 401);
    });

    test('token inventato: 401', async () => {
        const sessione = await accedi(ALICE);
        const falsa = {
            ...sessione,
            token: crypto.randomBytes(32).toString('hex'),
        };

        assert.equal(
            (await chiama('/playlist', { sessione: falsa })).stato,
            401,
        );
    });

    test('token giusto ma device_id di un altro dispositivo: 401', async () => {
        const sessione = await accedi(ALICE);
        const altroDevice = { ...sessione, deviceId: nuovoDevice() };

        assert.equal(
            (await chiama('/playlist', { sessione: altroDevice })).stato,
            401,
        );
    });

    test('sessione scaduta: 401 e la riga viene cancellata', async () => {
        const sessione = await accedi(ALICE);
        await db.query(
            'UPDATE sessioni SET scadenza = NOW() - INTERVAL 1 MINUTE WHERE device_id = ?',
            [sessione.deviceId],
        );

        assert.equal((await chiama('/playlist', { sessione })).stato, 401);

        const [righe] = await db.query(
            'SELECT id FROM sessioni WHERE device_id = ?',
            [sessione.deviceId],
        );
        assert.equal(righe.length, 0);
    });

    test('il catalogo resta pubblico', async () => {
        assert.equal((await chiama('/artisti')).stato, 200);
    });
});

describe('isolamento tra due utenti reali', () => {
    let alice;
    let bob;
    let playlistAlice;
    let playlistBob;

    before(async () => {
        alice = await accedi(ALICE);
        bob = await accedi(BOB);

        playlistAlice = (
            await chiama('/playlist', {
                metodo: 'POST',
                sessione: alice,
                corpo: { nome: 'Isolamento Alice' },
            })
        ).dati;
        await chiama(`/playlist/${playlistAlice.id}/brani`, {
            metodo: 'POST',
            sessione: alice,
            corpo: { branoId: 1 },
        });

        playlistBob = (
            await chiama('/playlist', {
                metodo: 'POST',
                sessione: bob,
                corpo: { nome: 'Isolamento Bob' },
            })
        ).dati;
        await chiama(`/playlist/${playlistBob.id}/brani`, {
            metodo: 'POST',
            sessione: bob,
            corpo: { branoId: 2 },
        });
    });

    after(async () => {
        await chiama(`/playlist/${playlistAlice.id}`, {
            metodo: 'DELETE',
            sessione: alice,
        });
        await chiama(`/playlist/${playlistBob.id}`, {
            metodo: 'DELETE',
            sessione: bob,
        });
    });

    // Stessi controlli nelle due direzioni: A contro B e B contro A.
    const coppie = [
        ['Bob sulla playlist di Alice', () => [bob, alice, playlistAlice, 1]],
        ['Alice sulla playlist di Bob', () => [alice, bob, playlistBob, 2]],
    ];

    for (const [nome, dati] of coppie) {
        describe(nome, () => {
            test('non la vede nel proprio elenco', async () => {
                const [intruso, , playlist] = dati();
                const elenco = await chiama('/playlist', { sessione: intruso });

                assert.equal(elenco.stato, 200);
                assert.ok(!elenco.dati.some(p => p.id === playlist.id));
            });

            test('non la legge, rinomina, svuota, riempie né elimina: 404', async () => {
                const [intruso, , playlist, branoId] = dati();
                const base = `/playlist/${playlist.id}`;

                const tentativi = [
                    await chiama(base, { sessione: intruso }),
                    await chiama(base, {
                        metodo: 'PUT',
                        sessione: intruso,
                        corpo: { nome: 'Rubata' },
                    }),
                    await chiama(`${base}/brani`, {
                        metodo: 'POST',
                        sessione: intruso,
                        corpo: { branoId: 3 },
                    }),
                    await chiama(`${base}/brani/${branoId}`, {
                        metodo: 'DELETE',
                        sessione: intruso,
                    }),
                    await chiama(base, { metodo: 'DELETE', sessione: intruso }),
                ];

                assert.deepEqual(
                    tentativi.map(t => t.stato),
                    [404, 404, 404, 404, 404],
                );
            });

            test('la playlist è rimasta intatta per il proprietario', async () => {
                const [, proprietario, playlist, branoId] = dati();
                const dettaglio = await chiama(`/playlist/${playlist.id}`, {
                    sessione: proprietario,
                });

                assert.equal(dettaglio.stato, 200);
                assert.equal(dettaglio.dati.nome, playlist.nome);
                assert.deepEqual(
                    dettaglio.dati.brani.map(b => b.id),
                    [branoId],
                );
            });
        });
    }
});

describe('logout e sessioni per dispositivo', () => {
    test('logout: chiude solo la sessione del dispositivo corrente', async () => {
        const telefono = await accedi(ALICE);
        const tablet = await accedi(ALICE);

        const esito = await chiama('/auth/logout', {
            metodo: 'POST',
            sessione: telefono,
        });

        assert.equal(esito.stato, 204);
        assert.equal(
            (await chiama('/auth/io', { sessione: telefono })).stato,
            401,
        );
        assert.equal(
            (await chiama('/auth/io', { sessione: tablet })).stato,
            200,
        );
    });

    test('logout-tutti: chiude le sessioni su tutti i dispositivi', async () => {
        const telefono = await accedi(ALICE);
        const tablet = await accedi(ALICE);
        const bob = await accedi(BOB);

        const esito = await chiama('/auth/logout-tutti', {
            metodo: 'POST',
            sessione: telefono,
        });

        assert.equal(esito.stato, 204);
        assert.equal(
            (await chiama('/auth/io', { sessione: telefono })).stato,
            401,
        );
        assert.equal(
            (await chiama('/auth/io', { sessione: tablet })).stato,
            401,
        );
        // Le sessioni degli altri utenti non vengono toccate.
        assert.equal((await chiama('/auth/io', { sessione: bob })).stato, 200);
    });

    test('un nuovo login sullo stesso dispositivo sostituisce la sessione', async () => {
        const deviceId = nuovoDevice();
        const primaAlice = await accedi(ALICE, deviceId);
        const poiBob = await accedi(BOB, deviceId);

        assert.equal(
            (await chiama('/auth/io', { sessione: primaAlice })).stato,
            401,
        );
        const io = await chiama('/auth/io', { sessione: poiBob });
        assert.equal(io.stato, 200);
        assert.equal(io.dati.email, BOB.email);
    });
});
