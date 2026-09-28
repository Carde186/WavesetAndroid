import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LogoHeaderLeft from './LogoHeaderLeft';
import { useAutenticazione } from '../autenticazione/ContestoAutenticazione';
import AccediSchermata from '../schermate/AccediSchermata';
import DettaglioAlbumSchermata from '../schermate/DettaglioAlbumSchermata';
import DettaglioArtistaSchermata from '../schermate/DettaglioArtistaSchermata';
import DettaglioBranoSchermata from '../schermate/DettaglioBranoSchermata';
import DettaglioEventoSchermata from '../schermate/DettaglioEventoSchermata';
import DettaglioPlaylistSchermata from '../schermate/DettaglioPlaylistSchermata';
import LeMiePlaylistSchermata from '../schermate/LeMiePlaylistSchermata';
import type { ParametriStackPlaylist } from './tipi';

const Stack = createNativeStackNavigator<ParametriStackPlaylist>();

// Schermate condizionali (pattern "authentication flow" di React Navigation):
// da anonimo lo stack contiene solo Accedi; al login/logout React Navigation
// sostituisce l'intero stack, così dopo un logout non restano schermate
// con dati dell'utente precedente.
function PlaylistStack() {
    const { utente } = useAutenticazione();

    if (!utente) {
        return (
            <Stack.Navigator>
                <Stack.Screen
                    name="Accedi"
                    component={AccediSchermata}
                    options={{ title: 'Playlist', headerLeft: LogoHeaderLeft }}
                />
            </Stack.Navigator>
        );
    }

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="LeMiePlaylist"
                component={LeMiePlaylistSchermata}
                options={{
                    title: 'Le mie playlist',
                    headerLeft: LogoHeaderLeft,
                }}
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
            <Stack.Screen
                name="DettaglioEvento"
                component={DettaglioEventoSchermata}
                options={{ title: 'Evento' }}
            />
        </Stack.Navigator>
    );
}

export default PlaylistStack;
