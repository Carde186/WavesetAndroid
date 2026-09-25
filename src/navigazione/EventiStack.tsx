import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LogoHeaderLeft from './LogoHeaderLeft';
import EventiSchermata from '../schermate/EventiSchermata';
import type { ParametriStackEventi } from './tipi';

const Stack = createNativeStackNavigator<ParametriStackEventi>();

function EventiStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Eventi"
                component={EventiSchermata}
                options={{ title: 'Eventi', headerLeft: LogoHeaderLeft }}
            />
        </Stack.Navigator>
    );
}

export default EventiStack;
