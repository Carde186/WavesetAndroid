import { richiediGet } from './client';
import type { CopertinaItunes, LinkBranoApple } from './tipi';

// Solo per i (pochi) album reali con una mappatura verificata lato backend
// (CLAUDE.md, "Catalogo reale") — 404 per qualunque altro album, incluso
// il seed dimostrativo: gestito da chi chiama come "nessuna copertina",
// mai un errore bloccante.
export function recuperaCopertinaItunes(
    albumId: number,
): Promise<CopertinaItunes> {
    return richiediGet(`/album/${albumId}/copertina-itunes`);
}

// Link alla TRACCIA (mai il link album) per i (soli) brani reali con una
// mappatura verificata lato backend. 404 per qualunque altro brano.
export function recuperaLinkBranoApple(
    branoId: number,
): Promise<LinkBranoApple> {
    return richiediGet(`/brani/${branoId}/link-apple`);
}
