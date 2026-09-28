import type { MapType, MapStyleElement } from 'react-native-maps';

import type { TipoMappa } from '../preferenze/ContestoPreferenze';
import { TOKEN_SCURO } from './token';

// Stile scuro per Google Maps (prop customMapStyle di react-native-maps),
// usato dal tipo di mappa "Scura" — una scelta indipendente dal tema
// chiaro/scuro dell'app (sono due preferenze distinte in ContestoPreferenze:
// si può avere l'app in tema chiaro e la mappa comunque scura, o viceversa).
// Per questo usa sempre TOKEN_SCURO fisso, non l'hook useToken: il colore
// della mappa "Scura" non deve cambiare se cambia il tema dell'app. Solo
// geometrie e testi in scala di grigio: l'unico colore resta l'accento viola
// dei marker.
export const STILE_MAPPA_SCURO: MapStyleElement[] = [
    { elementType: 'geometry', stylers: [{ color: TOKEN_SCURO.superficie }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    {
        elementType: 'labels.text.fill',
        stylers: [{ color: TOKEN_SCURO.testoSecondario }],
    },
    {
        elementType: 'labels.text.stroke',
        stylers: [{ color: TOKEN_SCURO.sfondo }],
    },
    {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{ color: TOKEN_SCURO.bordo }],
    },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: TOKEN_SCURO.bordo }],
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: TOKEN_SCURO.sfondo }],
    },
];

// Nessuno stile: array vuoto esplicito, non undefined. Su Android togliere
// la prop non garantisce che lo stile scuro applicato prima venga rimosso
// dalla mappa già visibile; un array vuoto lo azzera sempre.
const NESSUNO_STILE: MapStyleElement[] = [];

type PropsMappa = {
    mapType: MapType;
    customMapStyle: MapStyleElement[];
    userInterfaceStyle: 'light';
};

// Tipo di mappa scelto dall'utente -> prop di <MapView>. Lo stile scuro vale
// solo per "Scura" (base standard): Satellite e Ibrida non lo ricevono mai.
//
// userInterfaceStyle 'light': il default di react-native-maps è "system",
// che su Android diventa MapColorScheme.FOLLOW_SYSTEM; con il telefono in
// modalità scura Google disegnerebbe la mappa Standard con il proprio
// schema scuro (blu/verde acqua) invece della mappa chiara classica. Lo
// scuro, quando serve, lo dà il nostro stile ("Scura").
export function propsMappa(tipo: TipoMappa): PropsMappa {
    const base = { userInterfaceStyle: 'light' as const };

    switch (tipo) {
        case 'scura':
            return {
                ...base,
                mapType: 'standard',
                customMapStyle: STILE_MAPPA_SCURO,
            };
        case 'satellite':
            return {
                ...base,
                mapType: 'satellite',
                customMapStyle: NESSUNO_STILE,
            };
        case 'ibrida':
            return {
                ...base,
                mapType: 'hybrid',
                customMapStyle: NESSUNO_STILE,
            };
        default:
            return {
                ...base,
                mapType: 'standard',
                customMapStyle: NESSUNO_STILE,
            };
    }
}
