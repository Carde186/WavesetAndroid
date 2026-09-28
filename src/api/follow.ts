import { richiediDelete, richiediPut } from './client';

export function seguiArtista(artistaId: number): Promise<void> {
    return richiediPut(`/artisti/${artistaId}/segui`);
}

export function smettiDiSeguire(artistaId: number): Promise<void> {
    return richiediDelete(`/artisti/${artistaId}/segui`);
}
