import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PlaylistSchermata from '../schermate/PlaylistSchermata';
import type { ParametriStackPlaylist } from './tipi';

const Stack = createNativeStackNavigator<ParametriStackPlaylist>();

function PlaylistStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Playlist"
                component={PlaylistSchermata}
                options={{ title: 'Playlist' }}
            />
        </Stack.Navigator>
    );
}

export default PlaylistStack;
