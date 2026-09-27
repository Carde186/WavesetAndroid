import { Search, X } from 'lucide-react-native';

import BottoneIcona from '../componenti/BottoneIcona';
import { TOKEN } from '../tema/token';
import { useRicercaHome } from './ContestoRicercaHome';

// Lente a ricerca chiusa, X a ricerca aperta.
function LenteRicercaHeaderRight() {
    const { aperta, apri, chiudi } = useRicercaHome();

    return aperta ? (
        <BottoneIcona
            icona={X}
            accessibilityLabel="Chiudi la ricerca"
            colore={TOKEN.testoPrimario}
            onPress={chiudi}
        />
    ) : (
        <BottoneIcona
            icona={Search}
            accessibilityLabel="Cerca artisti e brani"
            colore={TOKEN.testoPrimario}
            onPress={apri}
        />
    );
}

// Le opzioni header* del native stack vengono chiamate come funzioni dentro
// il render di React Navigation (SceneView), non montate come componenti. Se
// si passasse direttamente LenteRicercaHeaderRight, i suoi hook finirebbero
// contati in SceneView, e comparendo o sparendo dall'header ne
// cambierebbero il numero ("Rendered more hooks"). Questa funzione
// restituisce invece un elemento: il componente viene montato a sé, con i
// propri hook.
export function mostraLenteRicercaHeaderRight() {
    return <LenteRicercaHeaderRight />;
}
