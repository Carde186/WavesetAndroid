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
    // Sempre false da anonimi.
    seguito: boolean;
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

export type Utente = {
    id: number;
    nome: string;
    email: string;
    ruolo: 'USER' | 'ADMIN';
};

// Evento completo di coordinate e lineup (GET /eventi, /eventi/:id, /novita).
export type Evento = EventoSintetico & {
    // null se l'evento non ha coordinate: niente marker, solo in lista.
    latitudine: number | null;
    longitudine: number | null;
    // In ordine alfabetico: il primo è quello mostrato sul marker.
    lineup: ArtistaSintetico[];
};

export type Novita = {
    // true: brani ed eventi degli artisti seguiti; false: ultime uscite del
    // catalogo (e nessun evento).
    personalizzato: boolean;
    brani: BranoDettaglio[];
    eventi: Evento[];
};

export type RisultatiRicerca = {
    artisti: ArtistaSintetico[];
    brani: BranoDettaglio[];
};

// Coda di revisione Ticketmaster (solo ADMIN). collegamento_da_confermare:
// l'import ha trovato un candidato Ticketmaster per questo artista, ma
// nessun ADMIN lo ha ancora confermato esplicitamente — vedi CLAUDE.md,
// "Integrazione Ticketmaster".
export type ArtistaLineupCoda = {
    id: number;
    nome: string;
    collegamento_da_confermare: boolean;
};

export type EventoCoda = {
    id: number;
    titolo: string;
    data_evento: string;
    ora_evento: string | null;
    luogo: string | null;
    citta: string | null;
    latitudine: number | null;
    longitudine: number | null;
    // Uno o più tra: coordinate_irrecuperabili, lineup_ambiguo,
    // lineup_non_confermato, id_artista_da_confermare, possibile_doppione
    // — uniti con "; ".
    motivo_revisione: string | null;
    lineup: ArtistaLineupCoda[];
};

// Sottoinsieme di EventoCoda modificabile con la correzione manuale.
export type CorrezioneEvento = Partial<
    Pick<
        EventoCoda,
        | 'titolo'
        | 'data_evento'
        | 'ora_evento'
        | 'luogo'
        | 'citta'
        | 'latitudine'
        | 'longitudine'
    >
>;

// Anteprima Spotify di sola lettura (solo ADMIN, artista/album fissi lato
// backend — non è il seed del catalogo, vedi CLAUDE.md).
export type SpotifyArtista = {
    nome: string;
    immagine_url: string | null;
    url_spotify: string | null;
};

export type SpotifyRelease = {
    id: string;
    nome: string;
    tipo: string;
    data_pubblicazione: string | null;
    numero_brani: number;
    copertina_url: string | null;
    url_spotify: string | null;
};

export type SpotifyBrano = {
    id: string;
    titolo: string;
    numero_traccia: number;
    durata_ms: number;
    url_spotify: string | null;
};

export type AnteprimaSpotify = {
    artista: SpotifyArtista;
    release: SpotifyRelease[];
    brani: SpotifyBrano[];
};

// Anteprima Deezer di sola lettura (solo ADMIN, schermata separata da
// quella Spotify — vedi CLAUDE.md). album può essere null: "Electronic
// Generations" è trattato come dato che può mancare, non presunto.
export type DeezerArtista = {
    nome: string;
    foto_url: string | null;
    url_deezer: string | null;
};

export type DeezerAlbum = {
    id: number;
    titolo: string;
    copertina_url: string | null;
    url_deezer: string | null;
};

export type DeezerBrano = {
    id: number;
    titolo: string;
    durata_secondi: number;
    url_deezer: string | null;
};

export type AnteprimaDeezer = {
    artista: DeezerArtista;
    album: DeezerAlbum | null;
    brani: DeezerBrano[];
};
