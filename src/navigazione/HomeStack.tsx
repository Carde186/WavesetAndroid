import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FornitoreRicercaHome } from './ContestoRicercaHome';
import { mostraLenteRicercaHeaderRight } from './LenteRicercaHeaderRight';
import LogoHeaderLeft from './LogoHeaderLeft';
import DettaglioAlbumSchermata from '../schermate/DettaglioAlbumSchermata';
import DettaglioArtistaSchermata from '../schermate/DettaglioArtistaSchermata';
import DettaglioBranoSchermata from '../schermate/DettaglioBranoSchermata';
import DettaglioEventoSchermata from '../schermate/DettaglioEventoSchermata';
import HomeSchermata from '../schermate/HomeSchermata';
import type { ParametriStackHome } from './tipi';

const Stack = createNativeStackNavigator<ParametriStackHome>();

function HomeStack() {
    return (
        <FornitoreRicercaHome>
            <Stack.Navigator>
                <Stack.Screen
                    name="Home"
                    component={HomeSchermata}
                    options={{
                        title: 'Home',
                        headerLeft: LogoHeaderLeft,
                        headerRight: mostraLenteRicercaHeaderRight,
                    }}
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
        </FornitoreRicercaHome>
    );
}

export default HomeStack;
