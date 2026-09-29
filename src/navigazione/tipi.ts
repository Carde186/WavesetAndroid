// Schermate di catalogo condivise tra gli stack che le ospitano (Home,
// Eventi, Playlist): un brano raggiunto dalla playlist deve poter aprire lo
// stesso Dettaglio artista/album di quello raggiunto dal catalogo, e un
// evento si apre sia dalla mappa sia da Dettaglio artista o dalle Novità.
export type ParametriCatalogo = {
    DettaglioArtista: { artistaId: number };
    DettaglioBrano: { branoId: number };
    DettaglioAlbum: { albumId: number };
    DettaglioEvento: { eventoId: number };
};

export type ParametriStackHome = ParametriCatalogo & {
    Home: undefined;
};

export type ParametriStackEventi = ParametriCatalogo & {
    Eventi: undefined;
};

export type ParametriStackPlaylist = ParametriCatalogo & {
    LeMiePlaylist: undefined;
    DettaglioPlaylist: { playlistId: number };
    Accedi: undefined;
};

export type ParametriStackProfilo = {
    Profilo: undefined;
    Accedi: undefined;
    // Registrata in entrambi i rami dello stack (loggato/anonimo): deve
    // restare raggiungibile anche da anonimo (CLAUDE.md, "Impostazioni" —
    // sezione Aspetto sempre accessibile).
    Impostazioni: undefined;
    // Solo nel ramo loggato, e solo se utente.ruolo === 'ADMIN' (vedi
    // ProfiloStack e ProfiloSchermata): coda di revisione Ticketmaster.
    CodaEventi: undefined;
    DettaglioEventoCoda: { eventoId: number };
    // Solo ADMIN: anteprima Spotify di sola lettura, non il seed del
    // catalogo (vedi CLAUDE.md, "Integrazioni esterne").
    AnteprimaSpotify: undefined;
    // Solo ADMIN: anteprima Deezer di sola lettura, schermata separata da
    // quella Spotify.
    AnteprimaDeezer: undefined;
};

export type ParametriTab = {
    HomeStack: undefined;
    EventiStack: undefined;
    PlaylistStack: undefined;
    ProfiloStack: undefined;
};

export type ParametriStackRadice = {
    Intro: undefined;
    Tabs: undefined;
};
