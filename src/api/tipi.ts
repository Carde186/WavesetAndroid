export type Genere = {
    id: number;
    nome: string;
};

export type ArtistaSintetico = {
    id: number;
    nome: string;
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
};

export type ArtistaDettaglio = {
    id: number;
    nome: string;
    bio: string | null;
    generi: Genere[];
    brani: BranoSintetico[];
    album: AlbumSintetico[];
};

export type BranoDettaglio = {
    id: number;
    titolo: string;
    dataPubblicazione: string | null;
    urlSpotify: string | null;
    artista: ArtistaSintetico;
    album: { id: number; titolo: string } | null;
};

export type AlbumDettaglio = {
    id: number;
    titolo: string;
    dataPubblicazione: string | null;
    artista: ArtistaSintetico;
    brani: {
        id: number;
        titolo: string;
        data_pubblicazione: string | null;
        url_spotify: string | null;
    }[];
};
