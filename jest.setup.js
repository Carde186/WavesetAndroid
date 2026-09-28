// Moduli nativi: in Jest non c'è il codice Android/iOS. Reanimated e Worklets
// sono gestiti dal loro resolver ufficiale (vedi jest.config.js); Keychain non
// fornisce un mock, quindi eccone uno minimo con le funzioni usate dall'app.
// react-native-maps ha il suo mock in __mocks__/react-native-maps.js (usato da
// Jest automaticamente per i pacchetti di node_modules).

// AsyncStorage vuoto: nessuna preferenza salvata, quindi valori predefiniti
// (tema scuro, mappa standard). getMany: usato da ContestoPreferenze per
// leggere tipoMappa e tema in un solo giro.
jest.mock('@react-native-async-storage/async-storage', () => ({
    __esModule: true,
    default: {
        getItem: jest.fn(async () => null),
        setItem: jest.fn(async () => {}),
        getMany: jest.fn(async keys =>
            Object.fromEntries(keys.map(chiave => [chiave, null])),
        ),
    },
}));

// Keychain vuoto: nessun token salvato, quindi l'app parte da anonima.
jest.mock('react-native-keychain', () => ({
    getGenericPassword: jest.fn(async () => false),
    setGenericPassword: jest.fn(async () => true),
    resetGenericPassword: jest.fn(async () => true),
}));
