import { richiediGet } from './client';
import type { Evento } from './tipi';

// "seguiti" richiede un utente loggato (il backend risponde 401 da anonimi).
export type FiltroEventi = 'tutti' | 'seguiti';

export function recuperaEventi(filtro: FiltroEventi): Promise<Evento[]> {
    return richiediGet(`/eventi?filtro=${filtro}`);
}

export function recuperaEvento(id: number): Promise<Evento> {
    return richiediGet(`/eventi/${id}`);
}
