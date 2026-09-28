-- Alice segue due artisti (feed Novità e filtro "Che seguo" popolati);
-- Bob non segue nessuno, per provare il fallback per chi non segue ancora
-- nessuno. Test A e Test B (solo test automatici) replicano la stessa
-- situazione, così i test non dipendono da quello che si fa a mano con
-- Alice e Bob.
INSERT INTO utente_artista (utente_id, artista_id) VALUES
    (1, 1),
    (1, 3),
    (4, 1),
    (4, 3);
