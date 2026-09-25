import { useCallback, useEffect, useState } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import {
    ActivityIndicator,
    IconButton,
    List,
    Text,
    useTheme,
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ExternalLink, Trash2 } from 'lucide-react-native';

import { creaIconaPaper } from '../componenti/iconaPaper';
import {
    recuperaDettaglioPlaylist,
    rimuoviDallaPlaylist,
} from '../api/playlist';
import type { BranoPlaylist, PlaylistDettaglio } from '../api/tipi';
import type { ParametriStackPlaylist } from '../navigazione/tipi';

type Props = NativeStackScreenProps<
    ParametriStackPlaylist,
    'DettaglioPlaylist'
>;

const iconaEsterna = creaIconaPaper(ExternalLink);
const iconaElimina = creaIconaPaper(Trash2);

function creaAzioniRiga(
    brano: BranoPlaylist,
    onRimuovi: (branoId: number) => void,
) {
    return ({ color }: { color: string }) => (
        <View style={stili.azioniRiga}>
            {brano.url_spotify && (
                <IconButton
                    icon={iconaEsterna}
                    iconColor={color}
                    onPress={() => Linking.openURL(brano.url_spotify!)}
                />
            )}
            <IconButton
                icon={iconaElimina}
                iconColor={color}
                onPress={() => onRimuovi(brano.id)}
            />
        </View>
    );
}

function DettaglioPlaylistSchermata({ route, navigation }: Props) {
    const tema = useTheme();
    const { playlistId } = route.params;

    const [playlist, setPlaylist] = useState<PlaylistDettaglio | null>(null);
    const [inCaricamento, setInCaricamento] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            setInCaricamento(true);

            recuperaDettaglioPlaylist(playlistId)
                .then(setPlaylist)
                .catch(() => setErrore('Impossibile caricare la playlist'))
                .finally(() => setInCaricamento(false));
        }, [playlistId]),
    );

    useEffect(() => {
        if (playlist) {
            navigation.setOptions({ title: playlist.nome });
        }
    }, [navigation, playlist]);

    function gestisciRimuovi(branoId: number) {
        setPlaylist(prec =>
            prec
                ? { ...prec, brani: prec.brani.filter(b => b.id !== branoId) }
                : prec,
        );
        rimuoviDallaPlaylist(playlistId, branoId).catch(() =>
            setErrore('Impossibile rimuovere il brano'),
        );
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

    if (errore || !playlist) {
        return (
            <View
                style={[
                    stili.contenitoreErrore,
                    { backgroundColor: tema.colors.background },
                ]}
            >
                <Text>{errore ?? 'Playlist non trovata'}</Text>
            </View>
        );
    }

    if (playlist.brani.length === 0) {
        return (
            <View
                style={[
                    stili.contenitoreErrore,
                    { backgroundColor: tema.colors.background },
                ]}
            >
                <Text>Questa playlist è vuota</Text>
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
            <List.Section>
                {playlist.brani.map(brano => (
                    <List.Item
                        key={brano.id}
                        title={brano.titolo}
                        description={brano.artista_nome}
                        onPress={() =>
                            navigation.navigate('DettaglioBrano', {
                                branoId: brano.id,
                            })
                        }
                        right={creaAzioniRiga(brano, gestisciRimuovi)}
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
    azioniRiga: {
        flexDirection: 'row',
    },
});

export default DettaglioPlaylistSchermata;
