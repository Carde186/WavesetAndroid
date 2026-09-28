// Follow utente -> artista: endpoint protetti, flag "seguito" nel dettaglio
// artista, isolamento tra due utenti reali.

const assert = require('node:assert/strict');
const { after, before, describe, test } = require('node:test');

const { ALICE, BOB, chiama, accedi, chiudi } = require('./aiuto');

// Artisti che nel seed nessuno segue: il test li segue e alla fine li
// rimette com'erano.
const ARTISTA = 2;
const ALTRO_ARTISTA = 4;

let alice;
let bob;

before(async () => {
    alice = await accedi(ALICE);
    bob = await accedi(BOB);
});

after(async () => {
    for (const id of [ARTISTA, ALTRO_ARTISTA]) {
        await chiama(`/artisti/${id}/segui`, {
            metodo: 'DELETE',
            sessione: alice,
        });
    }
    await chiudi();
});

async function seguito(id, sessione) {
    const { dati } = await chiama(`/artisti/${id}`, { sessione });
    return dati.seguito;
}

describe('follow', () => {
    test('da anonimo "seguito" è false e seguire richiede la sessione', async () => {
        assert.equal(await seguito(ARTISTA), false);

        const put = await chiama(`/artisti/${ARTISTA}/segui`, {
            metodo: 'PUT',
        });
        const del = await chiama(`/artisti/${ARTISTA}/segui`, {
            metodo: 'DELETE',
        });
        assert.equal(put.stato, 401);
        assert.equal(del.stato, 401);
    });

    test('seguire e smettere di seguire, in modo idempotente', async () => {
        const segui = () =>
            chiama(`/artisti/${ARTISTA}/segui`, {
                metodo: 'PUT',
                sessione: alice,
            });
        const smetti = () =>
            chiama(`/artisti/${ARTISTA}/segui`, {
                metodo: 'DELETE',
                sessione: alice,
            });

        assert.equal((await segui()).stato, 204);
        assert.equal((await segui()).stato, 204);
        assert.equal(await seguito(ARTISTA, alice), true);

        assert.equal((await smetti()).stato, 204);
        assert.equal((await smetti()).stato, 204);
        assert.equal(await seguito(ARTISTA, alice), false);
    });

    test('artista inesistente: 404', async () => {
        const risposta = await chiama('/artisti/999999/segui', {
            metodo: 'PUT',
            sessione: alice,
        });

        assert.equal(risposta.stato, 404);
    });

    test('isolamento: i follow di Alice non valgono per Bob', async () => {
        await chiama(`/artisti/${ALTRO_ARTISTA}/segui`, {
            metodo: 'PUT',
            sessione: alice,
        });

        assert.equal(await seguito(ALTRO_ARTISTA, alice), true);
        assert.equal(await seguito(ALTRO_ARTISTA, bob), false);
        assert.equal(await seguito(ALTRO_ARTISTA), false);

        // E Bob non può togliere il follow di Alice: DELETE agisce solo
        // sui propri.
        await chiama(`/artisti/${ALTRO_ARTISTA}/segui`, {
            metodo: 'DELETE',
            sessione: bob,
        });
        assert.equal(await seguito(ALTRO_ARTISTA, alice), true);
    });

    test('sessione non valida sul dettaglio: si prosegue da anonimi', async () => {
        const falsa = { ...alice, token: 'f'.repeat(64) };
        const risposta = await chiama(`/artisti/${ARTISTA}`, {
            sessione: falsa,
        });

        assert.equal(risposta.stato, 200);
        assert.equal(risposta.dati.seguito, false);
    });
});
