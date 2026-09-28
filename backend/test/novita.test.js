// Home collegata al follow: feed Novità (brani ed eventi degli artisti
// seguiti), generi ordinati per affinità, "Esplora per genere" senza gli
// artisti già seguiti. Seed: l'utente A segue Nova Circuit (1, House +
// Techno) e Lucent Wave (3, Trance); l'utente B nessuno.

const assert = require('node:assert/strict');
const { after, before, describe, test } = require('node:test');

const { db, UTENTE_A, UTENTE_B, chiama, accedi, chiudi } = require('./aiuto');

const SEGUITI_DA_A = [1, 3];

let utenteA;
let utenteB;

before(async () => {
    utenteA = await accedi(UTENTE_A);
    utenteB = await accedi(UTENTE_B);
});

after(chiudi);

describe('Novità', () => {
    test('chi segue qualcuno: solo brani degli artisti seguiti', async () => {
        const { dati } = await chiama('/novita', { sessione: utenteA });

        assert.equal(dati.personalizzato, true);
        assert.ok(dati.brani.length > 0);
        assert.ok(dati.brani.every(b => SEGUITI_DA_A.includes(b.artista.id)));
    });

    test('chi segue qualcuno: prossimi eventi con almeno un artista seguito', async () => {
        const { dati } = await chiama('/novita', { sessione: utenteA });

        assert.deepEqual(
            dati.eventi.map(e => e.titolo),
            ['Circuiti Live', 'Notte Elettrica'],
        );
        assert.ok(
            dati.eventi.every(e =>
                e.lineup.some(a => SEGUITI_DA_A.includes(a.id)),
            ),
        );
    });

    test('anonimo e chi non segue nessuno: ultime uscite, senza eventi', async () => {
        const anonimo = (await chiama('/novita')).dati;
        const diB = (await chiama('/novita', { sessione: utenteB })).dati;

        assert.equal(anonimo.personalizzato, false);
        assert.equal(diB.personalizzato, false);
        assert.deepEqual(anonimo.eventi, []);
        assert.deepEqual(diB, anonimo);
        // Il catalogo intero contiene anche artisti che A non segue.
        assert.ok(
            anonimo.brani.some(b => !SEGUITI_DA_A.includes(b.artista.id)),
        );
    });
});

describe('Esplora per genere', () => {
    test('generi: prima quelli degli artisti seguiti, poi alfabetico', async () => {
        const nomi = async sessione =>
            (await chiama('/generi', { sessione })).dati.map(g => g.nome);

        // House, Techno e Trance hanno un artista seguito da A;
        // Drum and Bass nessuno, quindi scende in fondo.
        assert.deepEqual(await nomi(utenteA), [
            'House',
            'Techno',
            'Trance',
            'Drum and Bass',
        ]);
        assert.deepEqual(await nomi(utenteB), [
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

        const perA = await ids(utenteA);
        assert.ok(perA.length > 0);
        assert.ok(perA.every(id => !SEGUITI_DA_A.includes(id)));

        // Anonimo e B vedono tutti gli artisti.
        assert.equal((await ids()).length, 4);
        assert.equal((await ids(utenteB)).length, 4);
    });

    test('ordine per numero di follower, poi per nome', async () => {
        // L'ordine atteso si calcola dai follower reali nel database, non
        // scritto a mano: così i follow fatti nelle prove manuali (Alice,
        // Bob) non rompono il test.
        const [conteggi] = await db.query(
            `SELECT a.nome, COUNT(ua.utente_id) AS follower
             FROM artista a
             LEFT JOIN utente_artista ua ON ua.artista_id = a.id
             GROUP BY a.id, a.nome`,
        );
        const atteso = conteggi
            .sort(
                (x, y) =>
                    y.follower - x.follower || x.nome.localeCompare(y.nome),
            )
            .map(r => r.nome);

        const nomi = (await chiama('/artisti')).dati.map(a => a.nome);

        assert.deepEqual(nomi, atteso);
    });

    test('filtro per genere invariato', async () => {
        const nomi = (await chiama('/artisti?genere_id=1')).dati.map(
            a => a.nome,
        );

        assert.deepEqual(nomi, ['Nova Circuit']);
    });
});
