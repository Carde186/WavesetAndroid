import { URL_BASE } from './config';

async function richiesta<T>(
    percorso: string,
    opzioni?: RequestInit,
): Promise<T> {
    const risposta = await fetch(`${URL_BASE}${percorso}`, opzioni);

    if (!risposta.ok) {
        throw new Error(`Richiesta fallita: ${percorso} (${risposta.status})`);
    }

    return risposta.json();
}

export function richiediGet<T>(percorso: string): Promise<T> {
    return richiesta<T>(percorso);
}

export function richiediPost<T>(percorso: string, corpo: unknown): Promise<T> {
    return richiesta<T>(percorso, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo),
    });
}

export function richiediPut<T>(percorso: string, corpo: unknown): Promise<T> {
    return richiesta<T>(percorso, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo),
    });
}

export function richiediDelete<T>(percorso: string): Promise<T> {
    return richiesta<T>(percorso, { method: 'DELETE' });
}
