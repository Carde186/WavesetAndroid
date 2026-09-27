import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LogoHeaderLeft from './LogoHeaderLeft';
import { useAutenticazione } from '../autenticazione/ContestoAutenticazione';
import AccediSchermata from '../schermate/AccediSchermata';
import ProfiloSchermata from '../schermate/ProfiloSchermata';
import type { ParametriStackProfilo } from './tipi';

const Stack = createNativeStackNavigator<ParametriStackProfilo>();

// Stesso schema di PlaylistStack: da anonimo c'è solo Accedi.
function ProfiloStack() {
    const { utente } = useAutenticazione();

    return (
        <Stack.Navigator>
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
        </Stack.Navigator>
    );
}

export default ProfiloStack;
