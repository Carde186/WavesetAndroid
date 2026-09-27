import { useEffect, useState } from 'react';

import { cercaNelCatalogo } from '../api/catalogo';
import type { RisultatiRicerca } from '../api/tipi';

// Stessa soglia del backend: sotto i 2 caratteri non si chiama nemmeno.
export const LUNGHEZZA_MINIMA_RICERCA = 2;
const ATTESA_MS = 300;

// Ricerca live nel catalogo a partire dal testo digitato. Il testo lo tiene
// chi chiama (può vivere in uno stato locale o in un contesto): l'hook si
// occupa solo di quando cercare e di quale risposta mostrare.
export function useRicerca(testo: string) {
    // Il testo "stabile": aggiornato solo dopo 300 ms senza digitare.
    const [testoCercato, setTestoCercato] = useState('');
    const [risultati, setRisultati] = useState<RisultatiRicerca | null>(null);
    const [inCaricamento, setInCaricamento] = useState(false);
    const [errore, setErrore] = useState<string | null>(null);

    // Debounce: ogni tasto cancella il timer precedente e ne avvia uno nuovo,
    // quindi la ricerca parte solo quando si smette di scrivere per 300 ms.
    useEffect(() => {
        const timer = setTimeout(
            () => setTestoCercato(testo.trim()),
            ATTESA_MS,
        );

        return () => clearTimeout(timer);
    }, [testo]);

    useEffect(() => {
        if (testoCercato.length < LUNGHEZZA_MINIMA_RICERCA) {
            setRisultati(null);
            setErrore(null);
            setInCaricamento(false);
            return;
        }

        // Le risposte possono arrivare in ordine diverso da quello di partenza
        // (una ricerca lenta per "no" dopo una veloce per "nov"). Quando parte
        // una ricerca nuova, il cleanup marca questa come superata e il suo
        // risultato viene ignorato: resta sempre quello dell'ultima.
        let superata = false;

        setInCaricamento(true);
        setErrore(null);

        cercaNelCatalogo(testoCercato)
            .then(nuovi => {
                if (!superata) {
                    setRisultati(nuovi);
                }
            })
            .catch(() => {
                if (!superata) {
                    setErrore('Impossibile completare la ricerca');
                }
            })
            .finally(() => {
                if (!superata) {
                    setInCaricamento(false);
                }
            });

        return () => {
            superata = true;
        };
    }, [testoCercato]);

    const troppoCorto = testo.trim().length < LUNGHEZZA_MINIMA_RICERCA;
    const nessunRisultato =
        risultati !== null &&
        risultati.artisti.length === 0 &&
        risultati.brani.length === 0;

    return {
        testoCercato,
        risultati,
        inCaricamento,
        errore,
        troppoCorto,
        nessunRisultato,
    };
}
