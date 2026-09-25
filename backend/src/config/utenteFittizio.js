// Id dell'utente usato temporaneamente al posto di un vero utente autenticato.
// Da rimuovere quando lo step "Autenticazione" introduce il JWT: le route che
// oggi importano questa costante leggeranno req.utente.id al suo posto.
const ID_UTENTE_FITTIZIO = 1;

module.exports = ID_UTENTE_FITTIZIO;
