export type Genere = {
    id: number;
    nome: string;
};

export type ArtistaSintetico = {
    id: number;
    nome: string;
    immagine_url: string | null;
};

export type BranoSintetico = {
    id: number;
    titolo: string;
    album_id: number | null;
    data_pubblicazione: string | null;
    url_spotify: string | null;
};

export type AlbumSintetico = {
    id: number;
    titolo: string;
    data_pubblicazione: string | null;
    copertina_url: string | null;
};

export type EventoSintetico = {
    id: number;
    titolo: string;
    data_evento: string;
    // "HH:MM:SS" locale del locale, mai convertito da/a UTC; null se ignoto.
    ora_evento: string | null;
    luogo: string | null;
    citta: string | null;
};

export type ArtistaDettaglio = {
    id: number;
    nome: string;
    bio: string | null;
    immagine_url: string | null;
    generi: Genere[];
    brani: BranoSintetico[];
    album: AlbumSintetico[];
    eventi: EventoSintetico[];
};

export type ArtistaRiferimento = {
    id: number;
    nome: string;
    immagineUrl: string | null;
};

export type AlbumRiferimento = {
    id: number;
    titolo: string;
    copertinaUrl: string | null;
};

export type BranoDettaglio = {
    id: number;
    titolo: string;
    dataPubblicazione: string | null;
    urlSpotify: string | null;
    artista: ArtistaRiferimento;
    album: AlbumRiferimento | null;
};

export type AlbumDettaglio = {
    id: number;
    titolo: string;
    dataPubblicazione: string | null;
    copertinaUrl: string | null;
    artista: ArtistaRiferimento;
    brani: {
        id: number;
        titolo: string;
        data_pubblicazione: string | null;
        url_spotify: string | null;
    }[];
};

export type PlaylistSintetica = {
    id: number;
    nome: string;
};

export type BranoPlaylist = {
    id: number;
    titolo: string;
    url_spotify: string | null;
    artista_nome: string;
    aggiunto_il: string;
};

export type PlaylistDettaglio = PlaylistSintetica & {
    brani: BranoPlaylist[];
};
