import { View } from 'react-native';
import { Search, X } from 'lucide-react-native';

import BottoneIcona from '../componenti/BottoneIcona';
import { useToken } from '../tema/useToken';
import AvatarUtente from './AvatarUtente';
import { useRicercaHome } from './ContestoRicercaHome';

// Lente e avatar a ricerca chiusa; a ricerca aperta solo la X, così il campo
// (CampoRicercaHeader) ha tutta la larghezza.
function LenteRicercaHeaderRight() {
    const { aperta, apri, chiudi } = useRicercaHome();
    // Prima del return condizionale sotto: stesso ordine di hook a ogni
    // render, apri o chiusa che sia la ricerca.
    const token = useToken();

    if (aperta) {
        return (
            <BottoneIcona
                icona={X}
                accessibilityLabel="Chiudi la ricerca"
                colore={token.testoPrimario}
                onPress={chiudi}
            />
        );
    }

    return (
        <View className="flex-row items-center gap-2">
            <BottoneIcona
                icona={Search}
                accessibilityLabel="Cerca artisti e brani"
                colore={token.testoPrimario}
                onPress={apri}
            />
            <AvatarUtente />
        </View>
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
