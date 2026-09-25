import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DettaglioAlbumSchermata from '../schermate/DettaglioAlbumSchermata';
import DettaglioArtistaSchermata from '../schermate/DettaglioArtistaSchermata';
import DettaglioBranoSchermata from '../schermate/DettaglioBranoSchermata';
import DettaglioPlaylistSchermata from '../schermate/DettaglioPlaylistSchermata';
import LeMiePlaylistSchermata from '../schermate/LeMiePlaylistSchermata';
import type { ParametriStackPlaylist } from './tipi';

const Stack = createNativeStackNavigator<ParametriStackPlaylist>();

function PlaylistStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="LeMiePlaylist"
                component={LeMiePlaylistSchermata}
                options={{ title: 'Le mie playlist' }}
            />
            <Stack.Screen
                name="DettaglioPlaylist"
                component={DettaglioPlaylistSchermata}
                options={{ title: 'Playlist' }}
            />
            <Stack.Screen
                name="DettaglioArtista"
                component={DettaglioArtistaSchermata}
                options={{ title: 'Artista' }}
            />
            <Stack.Screen
                name="DettaglioBrano"
                component={DettaglioBranoSchermata}
                options={{ title: 'Brano' }}
            />
            <Stack.Screen
                name="DettaglioAlbum"
                component={DettaglioAlbumSchermata}
                options={{ title: 'Album' }}
            />
        </Stack.Navigator>
    );
}

export default PlaylistStack;
