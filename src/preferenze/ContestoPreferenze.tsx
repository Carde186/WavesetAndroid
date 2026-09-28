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

type ValoreContesto = {
    tipoMappa: TipoMappa;
    impostaTipoMappa: (tipo: TipoMappa) => void;
};

const ContestoPreferenze = createContext<ValoreContesto | null>(null);

// Preferenze del dispositivo (non dell'utente): salvate in AsyncStorage,
// che non è cifrato ed è adatto a questo. I segreti (token, device_id)
// restano nel Keychain. Non dipendono dal login, quindi il logout non le
// tocca. Qui arriverà anche il tema chiaro/scuro (step Impostazioni).
export function FornitorePreferenze({ children }: { children: ReactNode }) {
    const [tipoMappa, setTipoMappa] = useState<TipoMappa>('standard');

    // Lettura unica all'avvio. È asincrona, ma la schermata di intro dura
    // più della lettura, quindi la mappa compare già con il tipo salvato.
    // Un valore non riconosciuto (es. da una versione vecchia) resta sul
    // predefinito.
    useEffect(() => {
        AsyncStorage.getItem(CHIAVE_TIPO_MAPPA)
            .then(salvato => {
                if (tipoMappaValido(salvato)) {
                    setTipoMappa(salvato);
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

    const valore = useMemo(
        () => ({ tipoMappa, impostaTipoMappa }),
        [tipoMappa, impostaTipoMappa],
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
