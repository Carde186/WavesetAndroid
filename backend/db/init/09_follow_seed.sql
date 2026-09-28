-- Alice segue due artisti (feed Novità e filtro "Che seguo" popolati);
-- Bob non segue nessuno, per provare il fallback per chi non segue ancora
-- nessuno.
INSERT INTO utente_artista (utente_id, artista_id) VALUES
    (1, 1),
    (1, 3);
