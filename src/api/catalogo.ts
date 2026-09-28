import { richiediGet } from './client';
import type {
    AlbumDettaglio,
    ArtistaDettaglio,
    ArtistaSintetico,
    BranoDettaglio,
    Genere,
    Novita,
    RisultatiRicerca,
} from './tipi';

export function recuperaGeneri(): Promise<Genere[]> {
    return richiediGet('/generi');
}

// escludiSeguiti: per un utente loggato, niente artisti che segue già
// (suggerimenti di "Esplora per genere"). Da anonimi non cambia nulla.
export function recuperaArtisti(
    genereId?: number,
    escludiSeguiti = false,
): Promise<ArtistaSintetico[]> {
    const parametri = [
        genereId ? `genere_id=${genereId}` : '',
        escludiSeguiti ? 'escludi_seguiti=1' : '',
    ].filter(Boolean);
    const filtro = parametri.length > 0 ? `?${parametri.join('&')}` : '';
    return richiediGet(`/artisti${filtro}`);
}

export function recuperaArtista(id: number): Promise<ArtistaDettaglio> {
    return richiediGet(`/artisti/${id}`);
}

export function recuperaBrano(id: number): Promise<BranoDettaglio> {
    return richiediGet(`/brani/${id}`);
}

export function recuperaNovita(): Promise<Novita> {
    return richiediGet('/novita');
}

export function recuperaAlbum(id: number): Promise<AlbumDettaglio> {
    return richiediGet(`/album/${id}`);
}

export function cercaNelCatalogo(testo: string): Promise<RisultatiRicerca> {
    return richiediGet(`/ricerca?q=${encodeURIComponent(testo)}`);
}
