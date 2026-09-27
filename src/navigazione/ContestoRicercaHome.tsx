import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';
import type { ReactNode } from 'react';
import { Keyboard } from 'react-native';

type ValoreContesto = {
    aperta: boolean;
    testo: string;
    setTesto: (testo: string) => void;
    apri: () => void;
    chiudi: () => void;
};

const ContestoRicercaHome = createContext<ValoreContesto | null>(null);

// Stato della ricerca della Home. Sta in un contesto fornito da HomeStack, e
// non in HomeSchermata, perché lo usano due alberi diversi: l'header (campo e
// lente, renderizzati dal navigatore) e il corpo della Home (l'overlay dei
// risultati). Stando sopra lo stack, sopravvive anche all'apertura di un
// dettaglio: tornando indietro la ricerca è ancora lì.
export function FornitoreRicercaHome({ children }: { children: ReactNode }) {
    const [aperta, setAperta] = useState(false);
    const [testo, setTesto] = useState('');

    const apri = useCallback(() => setAperta(true), []);

    const chiudi = useCallback(() => {
        Keyboard.dismiss();
        setAperta(false);
        setTesto('');
    }, []);

    const valore = useMemo(
        () => ({ aperta, testo, setTesto, apri, chiudi }),
        [aperta, testo, apri, chiudi],
    );

    return (
        <ContestoRicercaHome.Provider value={valore}>
            {children}
        </ContestoRicercaHome.Provider>
    );
}

export function useRicercaHome(): ValoreContesto {
    const valore = useContext(ContestoRicercaHome);

    if (!valore) {
        throw new Error('useRicercaHome va usato dentro FornitoreRicercaHome');
    }

    return valore;
}
