import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LogoHeaderLeft from './LogoHeaderLeft';
import { mostraProfiloHeaderRight } from './ProfiloHeaderRight';
import { useAutenticazione } from '../autenticazione/ContestoAutenticazione';
import AccediSchermata from '../schermate/AccediSchermata';
import ImpostazioniSchermata from '../schermate/ImpostazioniSchermata';
import ProfiloSchermata from '../schermate/ProfiloSchermata';
import type { ParametriStackProfilo } from './tipi';

const Stack = createNativeStackNavigator<ParametriStackProfilo>();

// Stesso schema di PlaylistStack per Profilo/Accedi: da anonimo c'è solo
// Accedi. Impostazioni è invece registrata in ENTRAMBI i rami (e non
// condizionata da `utente`): deve restare raggiungibile anche da anonimo,
// tramite l'icona nell'header (vedi ProfiloHeaderRight) — è l'unica
// schermata di questo stack che non dipende dal login.
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
            ) : (
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
