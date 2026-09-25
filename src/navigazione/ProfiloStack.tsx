import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LogoHeaderLeft from './LogoHeaderLeft';
import ProfiloSchermata from '../schermate/ProfiloSchermata';
import type { ParametriStackProfilo } from './tipi';

const Stack = createNativeStackNavigator<ParametriStackProfilo>();

function ProfiloStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Profilo"
                component={ProfiloSchermata}
                options={{ title: 'Profilo', headerLeft: LogoHeaderLeft }}
            />
        </Stack.Navigator>
    );
}

export default ProfiloStack;
