import { createNativeStackNavigator } from '@react-navigation/native-stack';

import IntroSchermata from '../schermate/IntroSchermata';
import TabNavigator from './TabNavigator';
import type { ParametriStackRadice } from './tipi';

const Stack = createNativeStackNavigator<ParametriStackRadice>();

function RadiceNavigazione() {
    return (
        <Stack.Navigator
            initialRouteName="Intro"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Intro" component={IntroSchermata} />
            <Stack.Screen name="Tabs" component={TabNavigator} />
        </Stack.Navigator>
    );
}

export default RadiceNavigazione;
