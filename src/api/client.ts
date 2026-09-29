import { URL_BASE } from './config';

// Errore con lo status HTTP: serve a distinguere "credenziali sbagliate"
// (401) da un backend irraggiungibile o da un errore del server.
export class ErroreRichiesta extends Error {
    stato: number;

    constructor(messaggio: string, stato: number) {
        super(messaggio);
        this.stato = stato;
    }
}

// Credenziali della sessione in memoria, impostate da ContestoAutenticazione:
// il Keychain si legge una volta all'avvio, non a ogni richiesta.
let deviceIdCorrente: string | null = null;
let tokenCorrente: string | null = null;
let gestisciSessioneScaduta: () => void = () => {};

export function impostaDeviceId(deviceId: string) {
    deviceIdCorrente = deviceId;
}

export function impostaToken(token: string | null) {
    tokenCorrente = token;
}

export function suSessioneScaduta(gestore: () => void) {
    gestisciSessioneScaduta = gestore;
}

async function richiesta<T>(
    percorso: string,
    opzioni: RequestInit = {},
): Promise<T> {
    const intestazioni: Record<string, string> = {
        ...(opzioni.headers as Record<string, string>),
    };

    if (deviceIdCorrente) {
        intestazioni['X-Device-Id'] = deviceIdCorrente;
    }

    const tokenInviato = tokenCorrente;
    if (tokenInviato) {
        intestazioni.Authorization = `Bearer ${tokenInviato}`;
    }

    const risposta = await fetch(`${URL_BASE}${percorso}`, {
        ...opzioni,
        headers: intestazioni,
    });

    // 401 con un token allegato = sessione scaduta o revocata (es. "esci da
    // tutti i dispositivi" da un altro telefono): si chiude anche quella
    // locale. Senza token è solo un login fallito, gestito da chi chiama.
    if (risposta.status === 401 && tokenInviato) {
        gestisciSessioneScaduta();
    }

    if (!risposta.ok) {
        throw new ErroreRichiesta(
            `Richiesta fallita: ${percorso} (${risposta.status})`,
            risposta.status,
        );
    }

    if (risposta.status === 204) {
        return undefined as T;
    }

    return risposta.json();
}

export function richiediGet<T>(percorso: string): Promise<T> {
    return richiesta<T>(percorso);
}

export function richiediPost<T>(percorso: string, corpo?: unknown): Promise<T> {
    return richiesta<T>(percorso, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
}

export function richiediPut<T>(percorso: string, corpo?: unknown): Promise<T> {
    return richiesta<T>(percorso, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
}

export function richiediDelete<T>(percorso: string): Promise<T> {
    return richiesta<T>(percorso, { method: 'DELETE' });
}

export function richiediPatch<T>(
    percorso: string,
    corpo?: unknown,
): Promise<T> {
    return richiesta<T>(percorso, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
}
