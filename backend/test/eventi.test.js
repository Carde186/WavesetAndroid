// Eventi: elenco (tutti / seguiti), dettaglio, esclusione degli eventi
// passati. Seed: Alice segue Nova Circuit e Lucent Wave, Bob nessuno.

const assert = require('node:assert/strict');
const { after, before, describe, test } = require('node:test');

const { db, ALICE, BOB, chiama, accedi, chiudi } = require('./aiuto');

const TITOLO_PASSATO = 'Evento passato di prova';

let alice;
let bob;

before(async () => {
    alice = await accedi(ALICE);
    bob = await accedi(BOB);

    // Evento di ieri con Nova Circuit (seguito da Alice): non deve comparire
    // né in "tutti" né in "seguiti".
    const [risultato] = await db.query(
        `INSERT INTO evento (titolo, data_evento, luogo, citta, latitudine, longitudine)
         VALUES (?, CURDATE() - INTERVAL 1 DAY, 'Luogo', 'Città', 45.0, 9.0)`,
        [TITOLO_PASSATO],
    );
    await db.query(
        'INSERT INTO evento_artista (evento_id, artista_id) VALUES (?, 1)',
        [risultato.insertId],
    );
});

after(async () => {
    await db.query('DELETE FROM evento WHERE titolo = ?', [TITOLO_PASSATO]);
    await chiudi();
});

const titoli = eventi => eventi.map(e => e.titolo);

describe('elenco eventi', () => {
    test('tutti: futuri, per data, con coordinate numeriche e lineup', async () => {
        const { stato, dati } = await chiama('/eventi');

        assert.equal(stato, 200);
        assert.deepEqual(titoli(dati), [
            'Circuiti Live',
            'Sunset Session',
            'Notte Elettrica',
            'Drum Night',
        ]);
        assert.equal(typeof dati[0].latitudine, 'number');
        assert.equal(typeof dati[0].longitudine, 'number');

        const notte = dati.find(e => e.titolo === 'Notte Elettrica');
        assert.deepEqual(
            notte.lineup.map(a => a.nome),
            ['Lucent Wave', 'Nova Circuit'],
        );
    });

    test('gli eventi passati non compaiono', async () => {
        const tutti = (await chiama('/eventi')).dati;
        const seguiti = (
            await chiama('/eventi?filtro=seguiti', { sessione: alice })
        ).dati;

        assert.ok(!titoli(tutti).includes(TITOLO_PASSATO));
        assert.ok(!titoli(seguiti).includes(TITOLO_PASSATO));
    });

    test('seguiti: solo eventi con almeno un artista seguito', async () => {
        const { dati } = await chiama('/eventi?filtro=seguiti', {
            sessione: alice,
        });

        assert.deepEqual(titoli(dati), ['Circuiti Live', 'Notte Elettrica']);
    });

    test('seguiti: isolato per utente (Bob non segue nessuno)', async () => {
        const { stato, dati } = await chiama('/eventi?filtro=seguiti', {
            sessione: bob,
        });

        assert.equal(stato, 200);
        assert.deepEqual(dati, []);
    });

    test('seguiti senza sessione: 401; filtro sconosciuto: 400', async () => {
        assert.equal((await chiama('/eventi?filtro=seguiti')).stato, 401);
        assert.equal((await chiama('/eventi?filtro=altro')).stato, 400);
    });
});

describe('dettaglio evento', () => {
    test('con lineup completo', async () => {
        const { stato, dati } = await chiama('/eventi/2');

        assert.equal(stato, 200);
        assert.equal(dati.titolo, 'Notte Elettrica');
        assert.equal(dati.ora_evento, '23:30:00');
        assert.deepEqual(
            dati.lineup.map(a => a.nome),
            ['Lucent Wave', 'Nova Circuit'],
        );
    });

    test('inesistente: 404', async () => {
        assert.equal((await chiama('/eventi/999999')).stato, 404);
    });
});
