import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Calendar, Home, ListMusic, User } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import EventiStack from './EventiStack';
import HomeStack from './HomeStack';
import PlaylistStack from './PlaylistStack';
import ProfiloStack from './ProfiloStack';
import type { ParametriTab } from './tipi';
import { TOKEN } from '../tema/token';

const Tab = createBottomTabNavigator<ParametriTab>();

const iconePerTab: Record<keyof ParametriTab, LucideIcon> = {
    HomeStack: Home,
    EventiStack: Calendar,
    PlaylistStack: ListMusic,
    ProfiloStack: User,
};

function creaTabBarIcon(nomeRoute: keyof ParametriTab) {
    const Icona = iconePerTab[nomeRoute];
    return ({ color, size }: { color: string; size: number }) => (
        <Icona color={color} size={size} />
    );
}

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: creaTabBarIcon(route.name as keyof ParametriTab),
                tabBarActiveTintColor: TOKEN.accento,
                tabBarInactiveTintColor: TOKEN.testoSecondario,
                tabBarStyle: {
                    backgroundColor: TOKEN.superficie,
                    borderTopColor: TOKEN.bordo,
                    borderTopWidth: 1,
                    elevation: 0,
                    shadowOpacity: 0,
                },
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
