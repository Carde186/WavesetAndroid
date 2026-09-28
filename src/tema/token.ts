// Sorgente per i punti dell'app che non passano da NativeWind/className
// (es. React Navigation, Lucide, il tabBarStyle di React Navigation, lo
// stile fisso della mappa "Scura"): duplica gli stessi valori esatti usati
// nelle classi NativeWind (vedi tailwind.config.js), perché quel file è
// consumato a build-time dal compilatore NativeWind, non importabile qui.
//
// Due palette — CLAUDE.md, "Identità visiva" (scura, esatta) e "Impostazioni"
// (chiara, derivata con la stessa logica di accento-scuro: valori esatti
// dove possibile, altrimenti scelti sulla scala Tailwind e verificati per
// contrasto — vedi il commento su TOKEN_CHIARO per i numeri).
export const TOKEN_SCURO = {
    sfondo: '#0B0B0F',
    superficie: '#16161D',
    accento: '#8B5CF6',
    accentoScuro: '#7C3AED',
    testoPrimario: '#F5F5F7',
    testoSecondario: '#9CA3AF',
    bordo: '#2A2A33',
    // Azioni distruttive (cestino): red-400 di Tailwind, non è un token di
    // CLAUDE.md (la tabella non definisce un colore di errore/pericolo).
    // Stesso valore nei due temi: il rosso di pericolo non cambia con il
    // tema, solo i neutri si invertono.
    pericolo: '#F87171',
    // Testo/icone sopra uno sfondo bg-accento o bg-accento-scuro (bottone
    // primario, pillola selezionata, avatar, badge lineup sulla mappa):
    // quello sfondo è fisso nei due temi (l'accento non cambia), quindi
    // anche il colore sopra deve restare fisso — MAI testoPrimario, che si
    // inverte con il tema e sparirebbe (testo quasi nero su viola in tema
    // chiaro). Stesso valore nei due temi, come pericolo.
    testoSuAccento: '#F5F5F7',
} as const;

// Palette chiara: sfondo e testo primario sono lo SCAMBIO esatto dei due
// token scuri corrispondenti (#F5F5F7 e #0B0B0F sono già valori approvati,
// nessuna invenzione su questi due). L'accento resta identico nei due temi
// — è l'identità monocromatica dell'app, non deve cambiare con il tema.
// I soli due valori nuovi sono il grigio del testo secondario e quello del
// bordo, scelti sulla scala di Tailwind (stessa famiglia di accento-scuro)
// e verificati per contrasto:
//   testo primario #0B0B0F su sfondo #F5F5F7: 18.04:1
//   testo secondario #4B5563 (gray-600) su sfondo #F5F5F7: 6.94:1
//   accento-scuro #7C3AED come testo/icona su sfondo #F5F5F7: 5.23:1
export const TOKEN_CHIARO = {
    sfondo: '#F5F5F7',
    superficie: '#FFFFFF',
    accento: '#8B5CF6',
    accentoScuro: '#7C3AED',
    testoPrimario: '#0B0B0F',
    testoSecondario: '#4B5563',
    bordo: '#E5E7EB',
    pericolo: '#F87171',
    testoSuAccento: '#F5F5F7',
} as const;

// Record<..., string> e non "typeof TOKEN_SCURO": quel tipo inferirebbe i
// valori esadecimali scuri come literal type, e TOKEN_CHIARO (stessi campi,
// valori diversi) non sarebbe assegnabile a "Token".
export type Token = Record<keyof typeof TOKEN_SCURO, string>;
