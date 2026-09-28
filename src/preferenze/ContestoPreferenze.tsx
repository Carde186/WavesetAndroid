import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import type { ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TipoMappa = 'standard' | 'scura' | 'satellite' | 'ibrida';

export const TIPI_MAPPA: { valore: TipoMappa; etichetta: string }[] = [
    { valore: 'standard', etichetta: 'Standard' },
    { valore: 'scura', etichetta: 'Scura' },
    { valore: 'satellite', etichetta: 'Satellite' },
    { valore: 'ibrida', etichetta: 'Ibrida' },
];

const CHIAVE_TIPO_MAPPA = 'waveset.preferenze.tipoMappa';

function tipoMappaValido(valore: string | null): valore is TipoMappa {
    return TIPI_MAPPA.some(tipo => tipo.valore === valore);
}

// Tema chiaro/scuro dell'app — CLAUDE.md, "Impostazioni": sempre accessibile,
// anche da anonimo. È la stessa categoria di preferenza del tipo di mappa
// (del dispositivo, non dell'utente), quindi vive nello stesso contesto.
export type Tema = 'scuro' | 'chiaro';

export const TEMI: { valore: Tema; etichetta: string }[] = [
    { valore: 'scuro', etichetta: 'Scuro' },
    { valore: 'chiaro', etichetta: 'Chiaro' },
];

const CHIAVE_TEMA = 'waveset.preferenze.tema';

function temaValido(valore: string | null): valore is Tema {
    return TEMI.some(tema => tema.valore === valore);
}

type ValoreContesto = {
    tipoMappa: TipoMappa;
    impostaTipoMappa: (tipo: TipoMappa) => void;
    tema: Tema;
    impostaTema: (tema: Tema) => void;
};

const ContestoPreferenze = createContext<ValoreContesto | null>(null);

// Preferenze del dispositivo (non dell'utente): salvate in AsyncStorage,
// che non è cifrato ed è adatto a questo. I segreti (token, device_id)
// restano nel Keychain. Non dipendono dal login, quindi il logout non le
// tocca.
export function FornitorePreferenze({ children }: { children: ReactNode }) {
    const [tipoMappa, setTipoMappa] = useState<TipoMappa>('standard');
    // Predefinito 'scuro': finché non si tocca il toggle, l'app resta
    // visivamente identica a com'era prima di questo tema (nessun cambio
    // a sorpresa per chi non ha mai aperto Impostazioni).
    const [tema, setTema] = useState<Tema>('scuro');

    // Lettura unica all'avvio, un solo giro verso lo storage (getMany
    // invece di due getItem separate — l'API 3.x di AsyncStorage restituisce
    // già un oggetto { chiave: valore }, non le coppie [chiave, valore]
    // della vecchia multiGet). È asincrona, ma la schermata di intro dura
    // più della lettura, quindi mappa e tema compaiono già con il valore
    // salvato. Un valore non riconosciuto (es. da una versione vecchia)
    // resta sul predefinito.
    useEffect(() => {
        AsyncStorage.getMany([CHIAVE_TIPO_MAPPA, CHIAVE_TEMA])
            .then(salvati => {
                if (tipoMappaValido(salvati[CHIAVE_TIPO_MAPPA])) {
                    setTipoMappa(salvati[CHIAVE_TIPO_MAPPA]);
                }
                if (temaValido(salvati[CHIAVE_TEMA])) {
                    setTema(salvati[CHIAVE_TEMA]);
                }
            })
            .catch(() => {});
    }, []);

    const impostaTipoMappa = useCallback((tipo: TipoMappa) => {
        setTipoMappa(tipo);
        // Se il salvataggio fallisce la scelta vale comunque fino alla
        // chiusura dell'app: non è un dato che valga un messaggio d'errore.
        AsyncStorage.setItem(CHIAVE_TIPO_MAPPA, tipo).catch(() => {});
    }, []);

    const impostaTema = useCallback((nuovoTema: Tema) => {
        setTema(nuovoTema);
        AsyncStorage.setItem(CHIAVE_TEMA, nuovoTema).catch(() => {});
    }, []);

    const valore = useMemo(
        () => ({ tipoMappa, impostaTipoMappa, tema, impostaTema }),
        [tipoMappa, impostaTipoMappa, tema, impostaTema],
    );

    return (
        <ContestoPreferenze.Provider value={valore}>
            {children}
        </ContestoPreferenze.Provider>
    );
}

export function usePreferenze(): ValoreContesto {
    const valore = useContext(ContestoPreferenze);

    if (!valore) {
        throw new Error('usePreferenze va usato dentro FornitorePreferenze');
    }

    return valore;
}
