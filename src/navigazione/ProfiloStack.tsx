import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LogoHeaderLeft from './LogoHeaderLeft';
import { mostraProfiloHeaderRight } from './ProfiloHeaderRight';
import { useAutenticazione } from '../autenticazione/ContestoAutenticazione';
import AccediSchermata from '../schermate/AccediSchermata';
import AnteprimaDeezerSchermata from '../schermate/admin/AnteprimaDeezerSchermata';
import AnteprimaSpotifySchermata from '../schermate/admin/AnteprimaSpotifySchermata';
import CodaEventiSchermata from '../schermate/admin/CodaEventiSchermata';
import DettaglioEventoCodaSchermata from '../schermate/admin/DettaglioEventoCodaSchermata';
import ImpostazioniSchermata from '../schermate/ImpostazioniSchermata';
import ProfiloSchermata from '../schermate/ProfiloSchermata';
import type { ParametriStackProfilo } from './tipi';

const Stack = createNativeStackNavigator<ParametriStackProfilo>();

// Stesso schema di PlaylistStack per Profilo/Accedi: da anonimo c'è solo
// Accedi. Impostazioni è invece registrata sempre (e non condizionata da
// `utente`): deve restare raggiungibile anche da anonimo, tramite l'icona
// nell'header (vedi ProfiloHeaderRight) — è l'unica schermata di questo
// stack che non dipende dal login. CodaEventi/DettaglioEventoCoda (coda di
// revisione Ticketmaster, CLAUDE.md "Cosa fa davvero l'ADMIN") compaiono
// solo per utente.ruolo === 'ADMIN': non basta nascondere il link
// d'ingresso in ProfiloSchermata, le route stesse non esistono per chi non
// è ADMIN — e comunque protette anche lato backend (richiediRuolo).
function ProfiloStack() {
    const { utente } = useAutenticazione();

    return (
        <Stack.Navigator
            screenOptions={{ headerRight: mostraProfiloHeaderRight }}
        >
            {utente ? (
                <Stack.Screen
                    name="Profilo"
                    component={ProfiloSchermata}
                    options={{ title: 'Profilo', headerLeft: LogoHeaderLeft }}
                />
            ) : null}
            {utente?.ruolo === 'ADMIN' && (
                <>
                    <Stack.Screen
                        name="CodaEventi"
                        component={CodaEventiSchermata}
                        options={{ title: 'Coda eventi' }}
                    />
                    <Stack.Screen
                        name="DettaglioEventoCoda"
                        component={DettaglioEventoCodaSchermata}
                        options={{ title: 'Evento in coda' }}
                    />
                    <Stack.Screen
                        name="AnteprimaSpotify"
                        component={AnteprimaSpotifySchermata}
                        options={{ title: 'Anteprima Spotify' }}
                    />
                    <Stack.Screen
                        name="AnteprimaDeezer"
                        component={AnteprimaDeezerSchermata}
                        options={{ title: 'Anteprima Deezer' }}
                    />
                </>
            )}
            {!utente && (
                <Stack.Screen
                    name="Accedi"
                    component={AccediSchermata}
                    options={{ title: 'Profilo', headerLeft: LogoHeaderLeft }}
                />
            )}
            <Stack.Screen
                name="Impostazioni"
                component={ImpostazioniSchermata}
                options={{ title: 'Impostazioni' }}
            />
        </Stack.Navigator>
    );
}

export default ProfiloStack;
