import { useEffect, useState } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import {
    ActivityIndicator,
    Button,
    IconButton,
    List,
    Snackbar,
    Text,
    useTheme,
} from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ExternalLink } from 'lucide-react-native';

import { creaIconaPaper } from '../componenti/iconaPaper';
import { recuperaArtista } from '../api/catalogo';
import type { ArtistaDettaglio } from '../api/tipi';
import type { ParametriCatalogo } from '../navigazione/tipi';

type Props = NativeStackScreenProps<ParametriCatalogo, 'DettaglioArtista'>;

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

function DettaglioArtistaSchermata({ route, navigation }: Props) {
    const tema = useTheme();
    const { artistaId } = route.params;

    const [artista, setArtista] = useState<ArtistaDettaglio | null>(null);
    const [inCaricamento, setInCaricamento] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);
    const [avvisoVisibile, setAvvisoVisibile] = useState(false);

    useEffect(() => {
        setInCaricamento(true);

        recuperaArtista(artistaId)
            .then(setArtista)
            .catch(() => setErrore('Impossibile caricare l’artista'))
            .finally(() => setInCaricamento(false));
    }, [artistaId]);

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

    if (errore || !artista) {
        return (
            <View
                style={[
                    stili.contenitoreErrore,
                    { backgroundColor: tema.colors.background },
                ]}
            >
                <Text>{errore ?? 'Artista non trovato'}</Text>
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
                {artista.nome}
            </Text>

            {artista.bio && <Text style={stili.bio}>{artista.bio}</Text>}

            <Button
                mode="outlined"
                style={stili.bottoneSegui}
                onPress={() => setAvvisoVisibile(true)}
            >
                Segui
            </Button>

            <Text variant="titleMedium" style={stili.titoloSezione}>
                Brani
            </Text>
            <List.Section>
                {artista.brani.map(brano => (
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

            <Text variant="titleMedium" style={stili.titoloSezione}>
                Album
            </Text>
            <List.Section>
                {artista.album.map(album => (
                    <List.Item
                        key={album.id}
                        title={album.titolo}
                        onPress={() =>
                            navigation.navigate('DettaglioAlbum', {
                                albumId: album.id,
                            })
                        }
                    />
                ))}
            </List.Section>

            <Snackbar
                visible={avvisoVisibile}
                onDismiss={() => setAvvisoVisibile(false)}
                duration={3000}
            >
                Accedi per seguire gli artisti
            </Snackbar>
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
    bio: {
        marginTop: 8,
        marginHorizontal: 16,
    },
    bottoneSegui: {
        marginTop: 16,
        marginHorizontal: 16,
        alignSelf: 'flex-start',
    },
    titoloSezione: {
        marginTop: 24,
        marginHorizontal: 16,
    },
});

export default DettaglioArtistaSchermata;
