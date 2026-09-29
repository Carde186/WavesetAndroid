const express = require('express');

const servizioDeezer = require('../../servizi/deezer');

const router = express.Router();

// Anteprima fissa (CLAUDE.md, "Integrazioni esterne" — Deezer): come quella
// Spotify, non è il seed del catalogo, solo una dimostrazione di sola
// lettura per l'ADMIN. Id verificati con una sonda reale prima di scrivere
// questo file.
const ARTISTA_ID = '3951'; // Carl Cox
const ALBUM_ID = '905333022'; // Electronic Generations
const LIMITE_BRANI = 5;

// Codici del corpo {"error": {"code": ...}} di Deezer (vedi
// src/servizi/deezer.js): presi da una libreria client open source di
// terzi, non dalla documentazione ufficiale Deezer (irraggiungibile in
// questa sessione, gated dietro login) — se in futuro risultassero
// sbagliati, l'effetto pratico è solo che un dato davvero assente
// verrebbe trattato come guasto (più prudente, mai il contrario).
const CODICE_DATI_NON_TROVATI = 800;
const CODICE_QUOTA_SUPERATA = 4;

function eDatoNonTrovato(errore) {
    return (
        errore instanceof servizioDeezer.ErroreDeezer &&
        errore.tipo === 'api' &&
        errore.codice === CODICE_DATI_NON_TROVATI
    );
}

function eQuotaSuperata(errore) {
    return (
        errore instanceof servizioDeezer.ErroreDeezer &&
        errore.tipo === 'api' &&
        errore.codice === CODICE_QUOTA_SUPERATA
    );
}

async function anteprima(req, res) {
    let artista;
    try {
        artista = await servizioDeezer.ottieniArtista(ARTISTA_ID);
    } catch {
        // Senza l'artista non c'è niente da mostrare: errore totale, non un
        // dato mancante parziale.
        res.status(502).json({ messaggio: 'Deezer non raggiungibile' });
        return;
    }

    // allSettled, non all: un guasto vero su una delle due chiamate (rete,
    // quota, un errore Deezer diverso da "dato non trovato") non deve mai
    // diventare in automatico un falso "dato assente" solo perché l'altra
    // chiamata gira dentro lo stesso Promise.all — vanno ispezionate una
    // per una.
    const [risultatoAlbum, risultatoBrani] = await Promise.allSettled([
        servizioDeezer.ottieniAlbum(ALBUM_ID),
        servizioDeezer.ottieniBraniAlbum(ALBUM_ID, { limit: LIMITE_BRANI }),
    ]);

    for (const risultato of [risultatoAlbum, risultatoBrani]) {
        if (risultato.status !== 'rejected') {
            continue;
        }
        if (eDatoNonTrovato(risultato.reason)) {
            // Dato davvero assente (Deezer lo dichiara esplicitamente):
            // stato vuoto legittimo, gestito sotto — non un errore.
            continue;
        }
        // Guasto vero: non si traveste da "dato assente". Fa fallire
        // l'intera risposta, come per l'artista.
        const quota = eQuotaSuperata(risultato.reason);
        res.status(quota ? 503 : 502).json({
            messaggio: quota
                ? 'Troppe richieste a Deezer, riprova più tardi'
                : 'Deezer non raggiungibile',
        });
        return;
    }

    const album =
        risultatoAlbum.status === 'fulfilled' ? risultatoAlbum.value : null;
    const brani =
        risultatoBrani.status === 'fulfilled' ? risultatoBrani.value : [];

    res.json({
        artista: {
            nome: artista.name,
            foto_url: artista.picture_medium ?? null,
            url_deezer: artista.link ?? null,
        },
        album: album
            ? {
                  id: album.id,
                  titolo: album.title,
                  copertina_url: album.cover_medium ?? null,
                  url_deezer: album.link ?? null,
              }
            : null,
        // Mai external/preview: solo i campi minimi richiesti, mai l'URL di
        // anteprima audio (che Deezer include come "preview" nel brano).
        brani: brani.slice(0, LIMITE_BRANI).map(t => ({
            id: t.id,
            titolo: t.title,
            durata_secondi: t.duration,
            url_deezer: t.link ?? null,
        })),
    });
}

router.get('/anteprima', anteprima);

module.exports = router;
