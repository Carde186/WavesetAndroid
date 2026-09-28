import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LogoHeaderLeft from './LogoHeaderLeft';
import DettaglioAlbumSchermata from '../schermate/DettaglioAlbumSchermata';
import DettaglioArtistaSchermata from '../schermate/DettaglioArtistaSchermata';
import DettaglioBranoSchermata from '../schermate/DettaglioBranoSchermata';
import DettaglioEventoSchermata from '../schermate/DettaglioEventoSchermata';
import EventiSchermata from '../schermate/EventiSchermata';
import type { ParametriStackEventi } from './tipi';

const Stack = createNativeStackNavigator<ParametriStackEventi>();

// Anche qui le schermate di catalogo: dal lineup di un evento si apre il
// Dettaglio artista, e da lì brani e album, senza cambiare tab.
function EventiStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Eventi"
                component={EventiSchermata}
                options={{ title: 'Eventi', headerLeft: LogoHeaderLeft }}
            />
            <Stack.Screen
                name="DettaglioEvento"
                component={DettaglioEventoSchermata}
                options={{ title: 'Evento' }}
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

export default EventiStack;
