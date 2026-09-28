/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            // Token dell'identità visiva — vedi CLAUDE.md, sezione
            // "Identità visiva" (valori scuri esatti) e "Impostazioni"
            // (valori chiari, derivati — vedi src/tema/token.ts per il
            // ragionamento sui contrasti).
            //
            // Ogni colore punta a una variabile CSS, non a un esadecimale
            // fisso: le variabili vengono impostate una volta sola, in cima
            // all'albero, da App.tsx (tramite vars() di NativeWind), con il
            // valore giusto per il tema corrente. Così tutte le classi già
            // scritte in ogni schermata (bg-sfondo, text-testo-primario...)
            // si aggiornano da sole al cambio di tema, senza toccare i file
            // che le usano.
            colors: {
                sfondo: 'var(--colore-sfondo)',
                superficie: 'var(--colore-superficie)',
                accento: 'var(--colore-accento)',
                // Sfondo dei controlli con etichetta di testo piccolo
                // (bottone primario, pillola selezionata): l'accento dà solo
                // 3,89:1 col testo primario, sotto il 4,5:1 WCAG AA. Stessa
                // tonalità, più scura: 5,23:1. L'accento "chiaro" resta per
                // tab attiva, link, icone e testo su sfondo/superficie.
                'accento-scuro': 'var(--colore-accento-scuro)',
                testo: {
                    primario: 'var(--colore-testo-primario)',
                    secondario: 'var(--colore-testo-secondario)',
                },
                bordo: 'var(--colore-bordo)',
                // Testo/icone sopra bg-accento o bg-accento-scuro (bottone
                // primario, pillola selezionata, avatar, badge sulla
                // mappa): quello sfondo non cambia con il tema, quindi
                // questo colore non può essere testo-primario (si
                // inverte). Stesso valore nei due temi — vedi
                // src/tema/token.ts.
                'testo-su-accento': 'var(--colore-testo-su-accento)',
            },
            borderRadius: {
                card: '8px',
                // "12–14px" in CLAUDE.md è un range, non un valore singolo:
                // due token per i due estremi, invece di sceglierne uno a
                // caso nel mezzo.
                'bottone-sm': '12px',
                'bottone-lg': '14px',
            },
        },
    },
    plugins: [],
};
