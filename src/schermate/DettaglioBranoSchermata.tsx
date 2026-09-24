import { useEffect, useState } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { recuperaBrano } from '../api/catalogo';
import type { BranoDettaglio } from '../api/tipi';
import type { ParametriStackHome } from '../navigazione/tipi';

type Props = NativeStackScreenProps<ParametriStackHome, 'DettaglioBrano'>;

function DettaglioBranoSchermata({ route, navigation }: Props) {
    const tema = useTheme();
    const { branoId } = route.params;

    const [brano, setBrano] = useState<BranoDettaglio | null>(null);
    const [inCaricamento, setInCaricamento] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);

    useEffect(() => {
        setInCaricamento(true);

        recuperaBrano(branoId)
            .then(setBrano)
            .catch(() => setErrore('Impossibile caricare il brano'))
            .finally(() => setInCaricamento(false));
    }, [branoId]);

    if (inCaricamento) {
        return (
            <View
                style={[
                    stili.contenitoreErrore,
                    { backgroundColor: tema.colors.background },
                ]}
            >
                <ActivityIndicator />
            </View>
        );
    }

    if (errore || !brano) {
        return (
            <View
                style={[
                    stili.contenitoreErrore,
                    { backgroundColor: tema.colors.background },
                ]}
            >
                <Text>{errore ?? 'Brano non trovato'}</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={[
                stili.contenitore,
                { backgroundColor: tema.colors.background },
            ]}
        >
            <Text variant="headlineMedium" style={stili.titolo}>
                {brano.titolo}
            </Text>

            <Text
                variant="bodyLarge"
                style={stili.artista}
                onPress={() =>
                    navigation.navigate('DettaglioArtista', {
                        artistaId: brano.artista.id,
                    })
                }
            >
                {brano.artista.nome}
            </Text>

            {brano.dataPubblicazione && (
                <Text style={stili.dettaglio}>
                    Pubblicato il {brano.dataPubblicazione.slice(0, 10)}
                </Text>
            )}

            {brano.album && (
                <Text
                    style={stili.dettaglio}
                    onPress={() =>
                        navigation.navigate('DettaglioAlbum', {
                            albumId: brano.album!.id,
                        })
                    }
                >
                    Da {brano.album.titolo}
                </Text>
            )}

            {brano.urlSpotify && (
                <Button
                    mode="contained"
                    icon="spotify"
                    style={stili.bottoneSpotify}
                    onPress={() => Linking.openURL(brano.urlSpotify!)}
                >
                    Ascolta su Spotify
                </Button>
            )}
        </ScrollView>
    );
}

const stili = StyleSheet.create({
    contenitore: {
        flex: 1,
    },
    contenitoreErrore: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titolo: {
        marginTop: 16,
        marginHorizontal: 16,
    },
    artista: {
        marginTop: 4,
        marginHorizontal: 16,
    },
    dettaglio: {
        marginTop: 8,
        marginHorizontal: 16,
    },
    bottoneSpotify: {
        marginTop: 24,
        marginHorizontal: 16,
        alignSelf: 'flex-start',
    },
});

export default DettaglioBranoSchermata;
