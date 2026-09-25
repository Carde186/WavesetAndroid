/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            // Token dell'identità visiva — vedi CLAUDE.md, sezione
            // "Identità visiva". Valori esatti, non approssimati.
            colors: {
                sfondo: '#0B0B0F',
                superficie: '#16161D',
                accento: '#8B5CF6',
                testo: {
                    primario: '#F5F5F7',
                    secondario: '#9CA3AF',
                },
                bordo: '#2A2A33',
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
