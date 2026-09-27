import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import type { ReactNode } from 'react';

import {
    login,
    logout,
    logoutTutti,
    recuperaUtenteCorrente,
} from '../api/autenticazione';
import {
    impostaDeviceId,
    impostaToken,
    suSessioneScaduta,
} from '../api/client';
import type { Utente } from '../api/tipi';
import {
    cancellaToken,
    leggiOCreaDeviceId,
    leggiToken,
    salvaToken,
} from './archivioSicuro';

type ValoreContesto = {
    utente: Utente | null;
    accedi: (email: string, password: string) => Promise<void>;
    esci: () => Promise<void>;
    esciDaTutti: () => Promise<void>;
};

const ContestoAutenticazione = createContext<ValoreContesto | null>(null);

export function FornitoreAutenticazione({ children }: { children: ReactNode }) {
    const [utente, setUtente] = useState<Utente | null>(null);

    const chiudiSessioneLocale = useCallback(async () => {
        impostaToken(null);
        setUtente(null);
        await cancellaToken();
    }, []);

    useEffect(() => {
        suSessioneScaduta(() => {
            chiudiSessioneLocale();
        });

        // All'avvio: device_id (creato al primo avvio) e token salvato. Il
        // token si verifica col backend invece di fidarsi del Keychain: può
        // essere scaduto o revocato da un altro dispositivo.
        async function ripristinaSessione() {
            impostaDeviceId(await leggiOCreaDeviceId());

            const token = await leggiToken();
            if (!token) {
                return;
            }

            impostaToken(token);
            // Un 401 chiude la sessione tramite suSessioneScaduta. Con il
            // backend irraggiungibile, invece, il token resta salvato e si
            // riprova al prossimo avvio.
            setUtente(await recuperaUtenteCorrente());
        }

        ripristinaSessione().catch(() => {});
    }, [chiudiSessioneLocale]);

    const accedi = useCallback(async (email: string, password: string) => {
        // Il device_id serve già al login: lo si rilegge nel caso in cui il
        // ripristino all'avvio non abbia ancora finito.
        impostaDeviceId(await leggiOCreaDeviceId());

        const risposta = await login(email, password);
        impostaToken(risposta.token);
        await salvaToken(risposta.token);
        setUtente(risposta.utente);
    }, []);

    const esci = useCallback(async () => {
        try {
            await logout();
        } finally {
            // Anche se il backend non risponde, sul telefono si esce comunque;
            // la sessione sul server resta fino alla sua scadenza.
            await chiudiSessioneLocale();
        }
    }, [chiudiSessioneLocale]);

    const esciDaTutti = useCallback(async () => {
        // Qui invece un errore non va nascosto: se la chiamata fallisce, gli
        // altri dispositivi sono ancora connessi e l'utente deve saperlo.
        await logoutTutti();
        await chiudiSessioneLocale();
    }, [chiudiSessioneLocale]);

    const valore = useMemo(
        () => ({ utente, accedi, esci, esciDaTutti }),
        [utente, accedi, esci, esciDaTutti],
    );

    return (
        <ContestoAutenticazione.Provider value={valore}>
            {children}
        </ContestoAutenticazione.Provider>
    );
}

export function useAutenticazione(): ValoreContesto {
    const valore = useContext(ContestoAutenticazione);

    if (!valore) {
        throw new Error(
            'useAutenticazione va usato dentro FornitoreAutenticazione',
        );
    }

    return valore;
}
