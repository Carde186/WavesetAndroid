import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfiloSchermata from '../schermate/ProfiloSchermata';
import type { ParametriStackProfilo } from './tipi';

const Stack = createNativeStackNavigator<ParametriStackProfilo>();

function ProfiloStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Profilo"
                component={ProfiloSchermata}
                options={{ title: 'Profilo' }}
            />
        </Stack.Navigator>
    );
}

export default ProfiloStack;
