import { richiediGet, richiediPost } from './client';
import type { Utente } from './tipi';

export function login(
    email: string,
    password: string,
): Promise<{ token: string; utente: Utente }> {
    return richiediPost('/auth/login', { email, password });
}

export function recuperaUtenteCorrente(): Promise<Utente> {
    return richiediGet('/auth/io');
}

export function logout(): Promise<void> {
    return richiediPost('/auth/logout');
}

export function logoutTutti(): Promise<void> {
    return richiediPost('/auth/logout-tutti');
}
