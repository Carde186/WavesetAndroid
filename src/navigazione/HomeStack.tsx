import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeSchermata from '../schermate/HomeSchermata';
import type { ParametriStackHome } from './tipi';

const Stack = createNativeStackNavigator<ParametriStackHome>();

function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeSchermata}
                options={{ title: 'Home' }}
            />
        </Stack.Navigator>
    );
}

export default HomeStack;
