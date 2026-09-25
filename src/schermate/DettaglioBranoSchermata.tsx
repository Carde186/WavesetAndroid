import { useEffect, useState } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Dialog,
    Divider,
    List,
    Portal,
    Snackbar,
    Text,
    TextInput,
    useTheme,
} from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ExternalLink, ListPlus } from 'lucide-react-native';

import { creaIconaPaper } from '../componenti/iconaPaper';
import { recuperaBrano } from '../api/catalogo';
import {
    aggiungiAllaPlaylist,
    creaPlaylist,
    elencaPlaylist,
} from '../api/playlist';
import type { BranoDettaglio, PlaylistSintetica } from '../api/tipi';
import type { ParametriCatalogo } from '../navigazione/tipi';

type Props = NativeStackScreenProps<ParametriCatalogo, 'DettaglioBrano'>;

const iconaEsterna = creaIconaPaper(ExternalLink);
const iconaAggiungiPlaylist = creaIconaPaper(ListPlus);

function DettaglioBranoSchermata({ route, navigation }: Props) {
    const tema = useTheme();
    const { branoId } = route.params;

    const [brano, setBrano] = useState<BranoDettaglio | null>(null);
    const [inCaricamento, setInCaricamento] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);
    const [messaggioAvviso, setMessaggioAvviso] = useState<string | null>(null);

    const [selettoreVisibile, setSelettoreVisibile] = useState(false);
    const [playlistDisponibili, setPlaylistDisponibili] = useState<
        PlaylistSintetica[]
    >([]);
    const [nomeNuovaPlaylist, setNomeNuovaPlaylist] = useState('');

    useEffect(() => {
        setInCaricamento(true);

        recuperaBrano(branoId)
            .then(setBrano)
            .catch(() => setErrore('Impossibile caricare il brano'))
            .finally(() => setInCaricamento(false));
    }, [branoId]);

    function apriSelettorePlaylist() {
        setNomeNuovaPlaylist('');
        setSelettoreVisibile(true);
        elencaPlaylist()
            .then(setPlaylistDisponibili)
            .catch(() =>
                setMessaggioAvviso('Impossibile caricare le playlist'),
            );
    }

    async function gestisciAggiungiA(playlist: PlaylistSintetica) {
        setSelettoreVisibile(false);
        try {
            await aggiungiAllaPlaylist(playlist.id, branoId);
            setMessaggioAvviso(`Aggiunto a "${playlist.nome}"`);
        } catch {
            setMessaggioAvviso('Impossibile aggiungere alla playlist');
        }
    }

    async function gestisciCreaEAggiungi() {
        const nome = nomeNuovaPlaylist.trim();

        if (!nome) {
            return;
        }

        setSelettoreVisibile(false);
        try {
            const nuova = await creaPlaylist(nome);
            await aggiungiAllaPlaylist(nuova.id, branoId);
            setMessaggioAvviso(`Aggiunto a "${nuova.nome}"`);
        } catch {
            setMessaggioAvviso('Impossibile creare la playlist');
        }
    }

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
                    icon={iconaEsterna}
                    style={stili.bottoneAzione}
                    onPress={() => Linking.openURL(brano.urlSpotify!)}
                >
                    Ascolta su Spotify
                </Button>
            )}

            <Button
                mode="outlined"
                icon={iconaAggiungiPlaylist}
                style={stili.bottoneAzione}
                onPress={apriSelettorePlaylist}
            >
                Aggiungi a playlist
            </Button>

            <Portal>
                <Dialog
                    visible={selettoreVisibile}
                    onDismiss={() => setSelettoreVisibile(false)}
                >
                    <Dialog.Title>Aggiungi a playlist</Dialog.Title>
                    <Dialog.Content>
                        {playlistDisponibili.map(playlist => (
                            <List.Item
                                key={playlist.id}
                                title={playlist.nome}
                                onPress={() => gestisciAggiungiA(playlist)}
                            />
                        ))}

                        <Divider style={stili.divisore} />

                        <TextInput
                            value={nomeNuovaPlaylist}
                            onChangeText={setNomeNuovaPlaylist}
                            placeholder="Nuova playlist"
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setSelettoreVisibile(false)}>
                            Annulla
                        </Button>
                        <Button onPress={gestisciCreaEAggiungi}>
                            Crea e aggiungi
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <Snackbar
                visible={messaggioAvviso !== null}
                onDismiss={() => setMessaggioAvviso(null)}
                duration={3000}
            >
                {messaggioAvviso}
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
    artista: {
        marginTop: 4,
        marginHorizontal: 16,
    },
    dettaglio: {
        marginTop: 8,
        marginHorizontal: 16,
    },
    bottoneAzione: {
        marginTop: 12,
        marginHorizontal: 16,
        alignSelf: 'flex-start',
    },
    divisore: {
        marginVertical: 8,
    },
});

export default DettaglioBranoSchermata;
