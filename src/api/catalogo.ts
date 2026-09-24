import { URL_BASE } from './config';
import type {
    AlbumDettaglio,
    ArtistaDettaglio,
    ArtistaSintetico,
    BranoDettaglio,
    Genere,
} from './tipi';

async function richiedi<T>(percorso: string): Promise<T> {
    const risposta = await fetch(`${URL_BASE}${percorso}`);

    if (!risposta.ok) {
        throw new Error(`Richiesta fallita: ${percorso} (${risposta.status})`);
    }

    return risposta.json();
}

export function recuperaGeneri(): Promise<Genere[]> {
    return richiedi('/generi');
}

export function recuperaArtisti(
    genereId?: number,
): Promise<ArtistaSintetico[]> {
    const filtro = genereId ? `?genere_id=${genereId}` : '';
    return richiedi(`/artisti${filtro}`);
}

export function recuperaArtista(id: number): Promise<ArtistaDettaglio> {
    return richiedi(`/artisti/${id}`);
}

export function recuperaBrano(id: number): Promise<BranoDettaglio> {
    return richiedi(`/brani/${id}`);
}

export function recuperaAlbum(id: number): Promise<AlbumDettaglio> {
    return richiedi(`/album/${id}`);
}
