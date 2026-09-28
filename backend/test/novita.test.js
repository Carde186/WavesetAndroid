// Home collegata al follow: feed Novità personalizzato, generi ordinati per
// affinità, "Esplora per genere" senza gli artisti già seguiti. Si basa sul
// seed: Alice segue Nova Circuit (1, House + Techno) e Lucent Wave (3,
// Trance); Bob non segue nessuno.

const assert = require('node:assert/strict');
const { after, before, describe, test } = require('node:test');

const { ALICE, BOB, chiama, accedi, chiudi } = require('./aiuto');

const SEGUITI_DA_ALICE = [1, 3];

let alice;
let bob;

before(async () => {
    alice = await accedi(ALICE);
    bob = await accedi(BOB);
});

after(chiudi);

describe('Novità', () => {
    test('chi segue qualcuno: solo brani degli artisti seguiti', async () => {
        const { dati } = await chiama('/brani/recenti', { sessione: alice });

        assert.equal(dati.personalizzato, true);
        assert.ok(dati.brani.length > 0);
        assert.ok(
            dati.brani.every(b => SEGUITI_DA_ALICE.includes(b.artista.id)),
        );
    });

    test('anonimo e chi non segue nessuno: ultime uscite di tutto il catalogo', async () => {
        const anonimo = (await chiama('/brani/recenti')).dati;
        const diBob = (await chiama('/brani/recenti', { sessione: bob })).dati;

        assert.equal(anonimo.personalizzato, false);
        assert.equal(diBob.personalizzato, false);
        assert.deepEqual(diBob.brani, anonimo.brani);
        // Il catalogo intero contiene anche artisti che Alice non segue.
        assert.ok(
            anonimo.brani.some(b => !SEGUITI_DA_ALICE.includes(b.artista.id)),
        );
    });
});

describe('Esplora per genere', () => {
    test('generi: prima quelli degli artisti seguiti, poi alfabetico', async () => {
        const nomi = async sessione =>
            (await chiama('/generi', { sessione })).dati.map(g => g.nome);

        // House, Techno e Trance hanno un artista seguito da Alice;
        // Drum and Bass nessuno, quindi scende in fondo.
        assert.deepEqual(await nomi(alice), [
            'House',
            'Techno',
            'Trance',
            'Drum and Bass',
        ]);
        assert.deepEqual(await nomi(bob), [
            'Drum and Bass',
            'House',
            'Techno',
            'Trance',
        ]);
    });

    test('suggerimenti: esclusi gli artisti già seguiti, solo per chi segue', async () => {
        const ids = async sessione =>
            (await chiama('/artisti?escludi_seguiti=1', { sessione })).dati.map(
                a => a.id,
            );

        const perAlice = await ids(alice);
        assert.ok(perAlice.length > 0);
        assert.ok(perAlice.every(id => !SEGUITI_DA_ALICE.includes(id)));

        // Anonimo e Bob vedono tutti gli artisti.
        assert.equal((await ids()).length, 4);
        assert.equal((await ids(bob)).length, 4);
    });

    test('ordine per numero di follower, poi per nome', async () => {
        const nomi = (await chiama('/artisti')).dati.map(a => a.nome);

        // Nova Circuit e Lucent Wave hanno un follower (Alice), gli altri 0.
        assert.deepEqual(nomi, [
            'Lucent Wave',
            'Nova Circuit',
            'Break Signal',
            'Sunset Grid',
        ]);
    });

    test('filtro per genere invariato', async () => {
        const nomi = (await chiama('/artisti?genere_id=1')).dati.map(
            a => a.nome,
        );

        assert.deepEqual(nomi, ['Nova Circuit']);
    });
});
