const MESI_ABBREVIATI = [
    'gen',
    'feb',
    'mar',
    'apr',
    'mag',
    'giu',
    'lug',
    'ago',
    'set',
    'ott',
    'nov',
    'dic',
];

// Il backend serializza le colonne DATE come ISO in UTC ("2027-02-13T00:00...").
// Si formatta dalla stringa e non passando da `new Date()`: il fuso del
// device (negativo rispetto a UTC) sposterebbe la data al giorno prima.
export function formattaData(iso: string): string {
    const [anno, mese, giorno] = iso.slice(0, 10).split('-');
    return `${Number(giorno)} ${MESI_ABBREVIATI[Number(mese) - 1]} ${anno}`;
}

// ora_evento arriva come "HH:MM:SS" (colonna TIME): è l'ora locale del locale,
// quindi si mostra così com'è, senza mai passare da `Date` e dal fuso del device.
export function formattaOra(ora: string): string {
    return ora.slice(0, 5);
}

export function annoDa(iso: string): string {
    return iso.slice(0, 4);
}
