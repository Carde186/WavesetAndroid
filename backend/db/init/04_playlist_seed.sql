-- Utenti di prova (niente registrazione in v1). Password in chiaro, solo
-- dati di prova da documentare nel README:
--   alice@waveset.test / alice-waveset   (USER)
--   bob@waveset.test   / bob-waveset     (USER)
--   admin@waveset.test / admin-waveset   (ADMIN)
-- Alice, Bob e Admin sono per le prove a mano (due USER distinti per
-- provare l'isolamento sulle playlist, l'ADMIN per la coda di revisione
-- eventi). Test A, Test B e Test Admin sono riservati ai test automatici
-- (npm test in backend/): i test non toccano mai Alice, Bob o Admin, così
-- non ne chiudono le sessioni e non ne cambiano i dati durante una prova a
-- mano in corso.
--   test-a@waveset.test     / test-a-waveset     (USER,  solo test automatici)
--   test-b@waveset.test     / test-b-waveset     (USER,  solo test automatici)
--   test-admin@waveset.test / test-admin-waveset (ADMIN, solo test automatici)
INSERT INTO utente (id, nome, email, password_hash, ruolo) VALUES
    (1, 'Alice', 'alice@waveset.test', '$2b$12$Td94R61SOZivSefzubwvNeVm7AYZYEMyyEPcdl5k5k2pA9u317UYC', 'USER'),
    (2, 'Bob', 'bob@waveset.test', '$2b$12$Gk2yTSMiEiJubbHnySLR6upm4gLgNBQJc6KGKX2PNFk4isHg0S/lW', 'USER'),
    (3, 'Admin', 'admin@waveset.test', '$2b$12$XmAG3ci9rsXXc0X4rJ6qyO86wKyAsX2yifYuxkhubMj7YEPzhgBIy', 'ADMIN'),
    (4, 'Test A', 'test-a@waveset.test', '$2b$12$9Me89RyxB8DliibYEnIbpue274UmGUq6JCdvcB.exnp6kXCLcuvYO', 'USER'),
    (5, 'Test B', 'test-b@waveset.test', '$2b$12$VhOCZZtk4AHv.syhGOTj5eXS8C0ACuE/m7usztvXpveW41RbdSX5q', 'USER'),
    (6, 'Test Admin', 'test-admin@waveset.test', '$2b$12$xzzqS1nge5PtMKXG/AzISeM0bn.rYI2vYt1i3m8WntA2SPX6UoF1K', 'ADMIN');

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
