import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DettaglioAlbumSchermata from '../schermate/DettaglioAlbumSchermata';
import DettaglioArtistaSchermata from '../schermate/DettaglioArtistaSchermata';
import DettaglioBranoSchermata from '../schermate/DettaglioBranoSchermata';
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

export default HomeStack;
