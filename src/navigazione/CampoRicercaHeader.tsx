import { useWindowDimensions, View } from 'react-native';

import CampoTesto from '../componenti/CampoTesto';
import { useRicercaHome } from './ContestoRicercaHome';

// Spazio lasciato a destra per il bottone di chiusura (40) più i margini
// dell'header: il campo prende tutto il resto della top bar.
const SPAZIO_RISERVATO = 88;

// Montato nell'header tramite mostraCampoRicercaHeader (in fondo al file),
// che è una funzione di modulo stabile: il campo non viene rimontato a ogni
// tasto e non perde il focus mentre si scrive. Il testo arriva dal contesto.
function CampoRicercaHeader() {
    const { testo, setTesto } = useRicercaHome();
    const { width } = useWindowDimensions();
    const larghezza = { width: width - SPAZIO_RISERVATO };

    return (
        <View style={larghezza}>
            <CampoTesto
                valore={testo}
                onCambiaTesto={setTesto}
                placeholder="Cerca artisti e brani"
                tipo="ricerca"
                autoFocus
            />
        </View>
    );
}

// Le opzioni header* del native stack vengono chiamate come funzioni dentro
// il render di React Navigation (SceneView), non montate come componenti. Se
// si passasse direttamente CampoRicercaHeader, i suoi hook finirebbero
// contati in SceneView, e comparendo o sparendo dall'header ne
// cambierebbero il numero ("Rendered more hooks"). Questa funzione
// restituisce invece un elemento: il componente viene montato a sé, con i
// propri hook.
export function mostraCampoRicercaHeader() {
    return <CampoRicercaHeader />;
}
