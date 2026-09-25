import {
    richiediDelete,
    richiediGet,
    richiediPost,
    richiediPut,
} from './client';
import type { PlaylistDettaglio, PlaylistSintetica } from './tipi';

export function elencaPlaylist(): Promise<PlaylistSintetica[]> {
    return richiediGet('/playlist');
}

export function creaPlaylist(nome: string): Promise<PlaylistSintetica> {
    return richiediPost('/playlist', { nome });
}

export function recuperaDettaglioPlaylist(
    id: number,
): Promise<PlaylistDettaglio> {
    return richiediGet(`/playlist/${id}`);
}

export function rinominaPlaylist(
    id: number,
    nome: string,
): Promise<PlaylistSintetica> {
    return richiediPut(`/playlist/${id}`, { nome });
}

export function eliminaPlaylist(id: number): Promise<{ messaggio: string }> {
    return richiediDelete(`/playlist/${id}`);
}

export function aggiungiAllaPlaylist(
    playlistId: number,
    branoId: number,
): Promise<{ messaggio: string }> {
    return richiediPost(`/playlist/${playlistId}/brani`, { branoId });
}

export function rimuoviDallaPlaylist(
    playlistId: number,
    branoId: number,
): Promise<{ messaggio: string }> {
    return richiediDelete(`/playlist/${playlistId}/brani/${branoId}`);
}
