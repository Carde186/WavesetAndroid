// Schermate di catalogo condivise tra gli stack che le ospitano (Home e
// Playlist): un brano raggiunto dalla playlist deve poter aprire lo stesso
// Dettaglio artista/album di quello raggiunto dal catalogo.
export type ParametriCatalogo = {
    DettaglioArtista: { artistaId: number };
    DettaglioBrano: { branoId: number };
    DettaglioAlbum: { albumId: number };
};

export type ParametriStackHome = ParametriCatalogo & {
    Home: undefined;
};

export type ParametriStackEventi = {
    Eventi: undefined;
};

export type ParametriStackPlaylist = ParametriCatalogo & {
    LeMiePlaylist: undefined;
    DettaglioPlaylist: { playlistId: number };
};

export type ParametriStackProfilo = {
    Profilo: undefined;
};

export type ParametriTab = {
    HomeStack: undefined;
    EventiStack: undefined;
    PlaylistStack: undefined;
    ProfiloStack: undefined;
};
