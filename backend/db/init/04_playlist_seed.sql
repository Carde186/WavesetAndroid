-- Utente fittizio TEMPORANEO: sostituito da utenti reali nello step
-- "Autenticazione". Id 1 è anche il valore hardcoded lato backend
-- (vedi src/config/utenteFittizio.js) finché non c'è un JWT da cui leggerlo.
INSERT INTO utente (id, nome) VALUES (1, 'Utente di prova');

-- Due playlist per verificare fin da subito che un utente possa averne più
-- di una (non solo quella di default).
INSERT INTO playlist (id, nome, utente_id) VALUES
    (1, 'La mia playlist', 1),
    (2, 'Techno preferiti', 1);

INSERT INTO playlist_brano (playlist_id, brano_id) VALUES
    (1, 1),
    (1, 3),
    (2, 1),
    (2, 2);
