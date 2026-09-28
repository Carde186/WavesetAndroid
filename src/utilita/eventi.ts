import type { EventoSintetico } from '../api/tipi';
import { formattaData, formattaOra } from './data';

// "13 feb 2027 · 22:00" (senza ora se non è nota).
export function quandoEvento(evento: EventoSintetico): string {
    return [
        formattaData(evento.data_evento),
        evento.ora_evento ? formattaOra(evento.ora_evento) : '',
    ]
        .filter(Boolean)
        .join(' · ');
}

// "Club Nord, Torino" (anche solo uno dei due, o stringa vuota).
export function doveEvento(evento: EventoSintetico): string {
    return [evento.luogo, evento.citta].filter(Boolean).join(', ');
}

// Riga unica per gli elenchi: "13 feb 2027 · 22:00 · Club Nord, Torino".
export function riepilogoEvento(evento: EventoSintetico): string {
    return [quandoEvento(evento), doveEvento(evento)]
        .filter(Boolean)
        .join(' · ');
}
