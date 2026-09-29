import { richiediGet } from './client';
import type { AnteprimaSpotify, LinkAlbumSpotify } from './tipi';

// 503 se le chiavi Spotify non sono configurate lato backend (vedi
// ErroreRichiesta.stato in client.ts) — la schermata lo gestisce come stato
// "non disponibile", non come un errore generico.
export function recuperaAnteprimaSpotify(): Promise<AnteprimaSpotify> {
    return richiediGet('/admin/spotify/anteprima');
}

// Link all'ALBUM (mai il link di un singolo brano) per i (soli) album
// reali con una mappatura verificata lato backend (CLAUDE.md, "Catalogo
// reale"). 404 per qualunque altro album, incluso il seed dimostrativo.
export function recuperaLinkAlbumSpotify(
    albumId: number,
): Promise<LinkAlbumSpotify> {
    return richiediGet(`/album/${albumId}/link-spotify`);
}
