import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Calendar, Home, ListMusic, User } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import EventiStack from './EventiStack';
import HomeStack from './HomeStack';
import PlaylistStack from './PlaylistStack';
import ProfiloStack from './ProfiloStack';
import type { ParametriTab } from './tipi';
import { useToken } from '../tema/useToken';

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
    // Letto qui, non dentro screenOptions: è un hook, e la callback di
    // screenOptions viene richiamata da React Navigation, non da React —
    // chiamarlo lì violerebbe le regole degli hook.
    const token = useToken();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: creaTabBarIcon(route.name as keyof ParametriTab),
                tabBarActiveTintColor: token.accento,
                tabBarInactiveTintColor: token.testoSecondario,
                tabBarStyle: {
                    backgroundColor: token.superficie,
                    borderTopColor: token.bordo,
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
