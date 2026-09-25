import { useEffect, useState } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import {
    ActivityIndicator,
    IconButton,
    List,
    Text,
    useTheme,
} from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ExternalLink } from 'lucide-react-native';

import { creaIconaPaper } from '../componenti/iconaPaper';
import { recuperaAlbum } from '../api/catalogo';
import type { AlbumDettaglio } from '../api/tipi';
import type { ParametriCatalogo } from '../navigazione/tipi';

type Props = NativeStackScreenProps<ParametriCatalogo, 'DettaglioAlbum'>;

const iconaEsterna = creaIconaPaper(ExternalLink);

function creaBottoneSpotify(url: string) {
    return ({ color }: { color: string }) => (
        <IconButton
            icon={iconaEsterna}
            iconColor={color}
            onPress={() => Linking.openURL(url)}
        />
    );
}

function DettaglioAlbumSchermata({ route, navigation }: Props) {
    const tema = useTheme();
    const { albumId } = route.params;

    const [album, setAlbum] = useState<AlbumDettaglio | null>(null);
    const [inCaricamento, setInCaricamento] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);

    useEffect(() => {
        setInCaricamento(true);

        recuperaAlbum(albumId)
            .then(setAlbum)
            .catch(() => setErrore('Impossibile caricare l’album'))
            .finally(() => setInCaricamento(false));
    }, [albumId]);

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

    if (errore || !album) {
        return (
            <View
                style={[
                    stili.contenitoreErrore,
                    { backgroundColor: tema.colors.background },
                ]}
            >
                <Text>{errore ?? 'Album non trovato'}</Text>
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
                {album.titolo}
            </Text>

            <Text
                variant="bodyLarge"
                style={stili.artista}
                onPress={() =>
                    navigation.navigate('DettaglioArtista', {
                        artistaId: album.artista.id,
                    })
                }
            >
                {album.artista.nome}
            </Text>

            {album.dataPubblicazione && (
                <Text style={stili.dettaglio}>
                    Pubblicato il {album.dataPubblicazione.slice(0, 10)}
                </Text>
            )}

            <Text variant="titleMedium" style={stili.titoloSezione}>
                Tracklist
            </Text>
            <List.Section>
                {album.brani.map(brano => (
                    <List.Item
                        key={brano.id}
                        title={brano.titolo}
                        onPress={() =>
                            navigation.navigate('DettaglioBrano', {
                                branoId: brano.id,
                            })
                        }
                        right={
                            brano.url_spotify
                                ? creaBottoneSpotify(brano.url_spotify)
                                : undefined
                        }
                    />
                ))}
            </List.Section>
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
    titoloSezione: {
        marginTop: 24,
        marginHorizontal: 16,
    },
});

export default DettaglioAlbumSchermata;
