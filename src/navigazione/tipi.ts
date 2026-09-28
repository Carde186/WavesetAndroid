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
