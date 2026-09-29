// Motivi restituiti da motivo_revisione (backend/src/ticketmaster/importa.js),
// uniti con "; ": si traducono uno per uno e si ricompongono per la UI.
const ETICHETTE: Record<string, string> = {
    coordinate_irrecuperabili: 'Coordinate mancanti',
    lineup_ambiguo: 'Nessun artista riconosciuto nel lineup',
    lineup_non_confermato: "L'artista cercato non è confermato nel lineup",
    id_artista_da_confermare:
        'Primo collegamento con questo artista: da confermare',
    possibile_doppione: 'Possibile doppione di un altro evento',
};

export function motiviLeggibili(motivoRevisione: string | null): string[] {
    if (!motivoRevisione) {
        return [];
    }

    return motivoRevisione
        .split(';')
        .map(m => m.trim())
        .filter(Boolean)
        .map(m => ETICHETTE[m] ?? m);
}
