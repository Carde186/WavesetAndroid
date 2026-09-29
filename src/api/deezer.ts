import { richiediGet } from './client';
import type { AnteprimaDeezer } from './tipi';

export function recuperaAnteprimaDeezer(): Promise<AnteprimaDeezer> {
    return richiediGet('/admin/deezer/anteprima');
}
