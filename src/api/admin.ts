import { richiediGet, richiediPatch, richiediPost } from './client';
import type { CorrezioneEvento, EventoCoda } from './tipi';

export function elencaCodaEventi(): Promise<EventoCoda[]> {
    return richiediGet('/admin/eventi/coda');
}

export function recuperaEventoInCoda(id: number): Promise<EventoCoda> {
    return richiediGet(`/admin/eventi/coda/${id}`);
}

export function correggiEvento(
    id: number,
    campi: CorrezioneEvento,
): Promise<void> {
    return richiediPatch(`/admin/eventi/${id}`, campi);
}

export function approvaEvento(id: number): Promise<void> {
    return richiediPost(`/admin/eventi/${id}/approva`);
}

export function scartaEvento(id: number): Promise<void> {
    return richiediPost(`/admin/eventi/${id}/scarta`);
}

export function confermaCollegamentoArtista(
    eventoId: number,
    artistaId: number,
): Promise<void> {
    return richiediPost(
        `/admin/eventi/${eventoId}/artisti/${artistaId}/conferma-collegamento`,
    );
}
