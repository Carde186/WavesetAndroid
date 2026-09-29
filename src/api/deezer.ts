import { richiediGet } from './client';
import type { AnteprimaDeezer, ScopriDeezer } from './tipi';

export function recuperaAnteprimaDeezer(): Promise<AnteprimaDeezer> {
    return richiediGet('/admin/deezer/anteprima');
}

// Sezione "Scopri su Deezer" in Home (utenti autenticati) — vedi
// routes/deezer.js sul backend.
export function recuperaScopriDeezer(): Promise<ScopriDeezer> {
    return richiediGet('/deezer/scopri');
}
