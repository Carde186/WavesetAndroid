-- Utenti di prova (niente registrazione in v1). Password in chiaro, solo
-- dati di prova da documentare nel README:
--   alice@waveset.test / alice-waveset   (USER)
--   bob@waveset.test   / bob-waveset     (USER)
--   admin@waveset.test / admin-waveset   (ADMIN)
-- Due USER distinti servono al test di isolamento sulle playlist.
INSERT INTO utente (id, nome, email, password_hash, ruolo) VALUES
    (1, 'Alice', 'alice@waveset.test', '$2b$12$Td94R61SOZivSefzubwvNeVm7AYZYEMyyEPcdl5k5k2pA9u317UYC', 'USER'),
    (2, 'Bob', 'bob@waveset.test', '$2b$12$Gk2yTSMiEiJubbHnySLR6upm4gLgNBQJc6KGKX2PNFk4isHg0S/lW', 'USER'),
    (3, 'Admin', 'admin@waveset.test', '$2b$12$XmAG3ci9rsXXc0X4rJ6qyO86wKyAsX2yifYuxkhubMj7YEPzhgBIy', 'ADMIN');

-- Alice ha più di una playlist (non solo quella di default), Bob una sua.
INSERT INTO playlist (id, nome, utente_id) VALUES
    (1, 'La mia playlist', 1),
    (2, 'Techno preferiti', 1),
    (3, 'Playlist di Bob', 2);

INSERT INTO playlist_brano (playlist_id, brano_id) VALUES
    (1, 1),
    (1, 3),
    (2, 1),
    (2, 2),
    (3, 4);
