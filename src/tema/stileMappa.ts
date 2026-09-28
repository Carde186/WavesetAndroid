import { TOKEN } from './token';

// Stile scuro per Google Maps (prop customMapStyle di react-native-maps),
// costruito sui token dell'app invece che sulla mappa chiara di default, che
// su sfondo #0B0B0F sarebbe l'unico elemento chiaro della schermata. Solo
// geometrie e testi in scala di grigio: l'unico colore resta l'accento viola
// dei marker.
export const STILE_MAPPA_SCURO = [
    { elementType: 'geometry', stylers: [{ color: TOKEN.superficie }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    {
        elementType: 'labels.text.fill',
        stylers: [{ color: TOKEN.testoSecondario }],
    },
    { elementType: 'labels.text.stroke', stylers: [{ color: TOKEN.sfondo }] },
    {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{ color: TOKEN.bordo }],
    },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: TOKEN.bordo }],
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: TOKEN.sfondo }],
    },
];
