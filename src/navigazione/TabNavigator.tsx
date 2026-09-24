import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icona, {
    type MaterialDesignIconsIconName,
} from '@react-native-vector-icons/material-design-icons';

import EventiStack from './EventiStack';
import HomeStack from './HomeStack';
import PlaylistStack from './PlaylistStack';
import ProfiloStack from './ProfiloStack';
import type { ParametriTab } from './tipi';

const Tab = createBottomTabNavigator<ParametriTab>();

const iconePerTab: Record<keyof ParametriTab, MaterialDesignIconsIconName> = {
    HomeStack: 'home',
    EventiStack: 'calendar',
    PlaylistStack: 'music-box-multiple',
    ProfiloStack: 'account',
};

function creaTabBarIcon(nomeRoute: keyof ParametriTab) {
    return ({ color, size }: { color: string; size: number }) => (
        <Icona name={iconePerTab[nomeRoute]} color={color} size={size} />
    );
}

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: creaTabBarIcon(route.name as keyof ParametriTab),
            })}
        >
            <Tab.Screen
                name="HomeStack"
                component={HomeStack}
                options={{ title: 'Home' }}
            />
            <Tab.Screen
                name="EventiStack"
                component={EventiStack}
                options={{ title: 'Eventi' }}
            />
            <Tab.Screen
                name="PlaylistStack"
                component={PlaylistStack}
                options={{ title: 'Playlist' }}
            />
            <Tab.Screen
                name="ProfiloStack"
                component={ProfiloStack}
                options={{ title: 'Profilo' }}
            />
        </Tab.Navigator>
    );
}

export default TabNavigator;
