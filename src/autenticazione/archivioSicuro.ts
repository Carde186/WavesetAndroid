import * as Keychain from 'react-native-keychain';

// Token e device_id stanno nel Keychain (su Android: cifrati con una chiave
// dell'Android Keystore), non in AsyncStorage, che è un file in chiaro.
const SERVIZIO_TOKEN = 'waveset.sessione';
const SERVIZIO_DEVICE = 'waveset.dispositivo';

// UUID v4 da Math.random: il device_id è solo un identificatore, non un
// segreto (la sicurezza sta nel token), quindi basta che sia unico. Hermes
// non ha crypto.randomUUID.
function generaUuid(): string {
    const esadecimale = () => Math.floor(Math.random() * 16).toString(16);
    const variante = () => '89ab'[Math.floor(Math.random() * 4)];

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c =>
        c === 'x' ? esadecimale() : variante(),
    );
}

async function leggi(servizio: string): Promise<string | null> {
    const credenziali = await Keychain.getGenericPassword({
        service: servizio,
    });

    return credenziali ? credenziali.password : null;
}

// Generato al primo avvio e poi sempre lo stesso: identifica "questo
// telefono" anche tra un login e l'altro.
export async function leggiOCreaDeviceId(): Promise<string> {
    const esistente = await leggi(SERVIZIO_DEVICE);

    if (esistente) {
        return esistente;
    }

    const nuovo = generaUuid();
    await Keychain.setGenericPassword('device', nuovo, {
        service: SERVIZIO_DEVICE,
    });

    return nuovo;
}

export function leggiToken(): Promise<string | null> {
    return leggi(SERVIZIO_TOKEN);
}

export async function salvaToken(token: string): Promise<void> {
    await Keychain.setGenericPassword('sessione', token, {
        service: SERVIZIO_TOKEN,
    });
}

export async function cancellaToken(): Promise<void> {
    await Keychain.resetGenericPassword({ service: SERVIZIO_TOKEN });
}
