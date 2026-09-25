import { richiediGet } from './client';
import type {
    AlbumDettaglio,
    ArtistaDettaglio,
    ArtistaSintetico,
    BranoDettaglio,
    Genere,
} from './tipi';

export function recuperaGeneri(): Promise<Genere[]> {
    return richiediGet('/generi');
}

export function recuperaArtisti(
    genereId?: number,
): Promise<ArtistaSintetico[]> {
    const filtro = genereId ? `?genere_id=${genereId}` : '';
    return richiediGet(`/artisti${filtro}`);
}

export function recuperaArtista(id: number): Promise<ArtistaDettaglio> {
    return richiediGet(`/artisti/${id}`);
}

export function recuperaBrano(id: number): Promise<BranoDettaglio> {
    return richiediGet(`/brani/${id}`);
}

export function recuperaBraniRecenti(): Promise<BranoDettaglio[]> {
    return richiediGet('/brani/recenti');
}

export function recuperaAlbum(id: number): Promise<AlbumDettaglio> {
    return richiediGet(`/album/${id}`);
}
