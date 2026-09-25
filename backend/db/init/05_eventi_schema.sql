-- Evento minimale: serve alla sezione "Prossimi eventi" di Dettaglio artista.
-- Lo step "Eventi + mappa" lo estenderà (revisione Ticketmaster, ecc.) invece
-- di sostituirlo. latitudine/longitudine sono già nel modello dati
-- (CLAUDE.md) anche se oggi nessuna schermata le usa.
--
-- data_evento è DATE (non DATETIME) di proposito: un orario senza fuso del
-- luogo verrebbe mostrato sbagliato sul device (il JSON lo serializza in UTC).
CREATE TABLE evento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titolo VARCHAR(200) NOT NULL,
    data_evento DATE NOT NULL,
    luogo VARCHAR(200),
    citta VARCHAR(100),
    latitudine DECIMAL(9,6),
    longitudine DECIMAL(9,6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Lineup: N:N pura, nessun campo "ruolo" in v1 (CLAUDE.md).
CREATE TABLE evento_artista (
    evento_id INT NOT NULL,
    artista_id INT NOT NULL,
    PRIMARY KEY (evento_id, artista_id),
    FOREIGN KEY (evento_id) REFERENCES evento(id) ON DELETE CASCADE,
    FOREIGN KEY (artista_id) REFERENCES artista(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
