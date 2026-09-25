// Sorgente per i punti dell'app che non passano da NativeWind/className
// (es. React Navigation, che vuole colori diretti nelle sue API di tema).
// Stessi valori esatti della tabella "Identità visiva" in CLAUDE.md e di
// tailwind.config.js — duplicati qui perché tailwind.config.js è consumato
// a build-time dal compilatore NativeWind, non importabile a runtime.
export const TOKEN = {
    sfondo: '#0B0B0F',
    superficie: '#16161D',
    accento: '#8B5CF6',
    testoPrimario: '#F5F5F7',
    testoSecondario: '#9CA3AF',
    bordo: '#2A2A33',
} as const;
