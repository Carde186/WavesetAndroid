import { useCallback, useEffect, useState } from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ExternalLink, Trash2 } from 'lucide-react-native';

import {
    recuperaDettaglioPlaylist,
    rimuoviDallaPlaylist,
} from '../api/playlist';
import type { PlaylistDettaglio } from '../api/tipi';
import Avviso from '../componenti/Avviso';
import BottoneIcona from '../componenti/BottoneIcona';
import RigaElenco from '../componenti/RigaElenco';
import StatoSchermata from '../componenti/StatoSchermata';
import type { ParametriStackPlaylist } from '../navigazione/tipi';
import { useToken } from '../tema/useToken';

type Props = NativeStackScreenProps<
    ParametriStackPlaylist,
    'DettaglioPlaylist'
>;

function DettaglioPlaylistSchermata({ route, navigation }: Props) {
    const { playlistId } = route.params;

    const [playlist, setPlaylist] = useState<PlaylistDettaglio | null>(null);
    const [inCaricamento, setInCaricamento] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);
    const [messaggioAvviso, setMessaggioAvviso] = useState<string | null>(null);
    const token = useToken();

    const ricaricaPlaylist = useCallback(() => {
        setInCaricamento(true);
        setErrore(null);

        recuperaDettaglioPlaylist(playlistId)
            .then(setPlaylist)
            .catch(() => setErrore('Impossibile caricare la playlist'))
            .finally(() => setInCaricamento(false));
    }, [playlistId]);

    useFocusEffect(ricaricaPlaylist);

    useEffect(() => {
        if (playlist) {
            navigation.setOptions({ title: playlist.nome });
        }
    }, [navigation, playlist]);

    function gestisciRimuovi(branoId: number) {
        // Rimozione ottimistica, come per l'eliminazione delle playlist: se
        // il backend fallisce si ricarica e il brano ricompare, invece di
        // sostituire l'intera schermata con un errore.
        setPlaylist(prec =>
            prec
                ? { ...prec, brani: prec.brani.filter(b => b.id !== branoId) }
                : prec,
        );
        rimuoviDallaPlaylist(playlistId, branoId).catch(() => {
            setMessaggioAvviso('Impossibile rimuovere il brano');
            ricaricaPlaylist();
        });
    }

    if (inCaricamento) {
        return <StatoSchermata tipo="caricamento" />;
    }

    if (errore || !playlist) {
        return (
            <StatoSchermata
                tipo="errore"
                messaggio={errore ?? 'Playlist non trovata'}
            />
        );
    }

    return (
        <View className="flex-1 bg-sfondo">
            {playlist.brani.length === 0 ? (
                <StatoSchermata
                    tipo="vuoto"
                    messaggio="Questa playlist è vuota"
                />
            ) : (
                <ScrollView contentContainerClassName="pb-24">
                    {playlist.brani.map(brano => (
                        <RigaElenco
                            key={brano.id}
                            titolo={brano.titolo}
                            sottotitolo={brano.artista_nome}
                            onPress={() =>
                                navigation.navigate('DettaglioBrano', {
                                    branoId: brano.id,
                                })
                            }
                            destra={
                                <View className="flex-row">
                                    {brano.url_spotify && (
                                        <BottoneIcona
                                            icona={ExternalLink}
                                            accessibilityLabel={`Ascolta ${brano.titolo} su Spotify`}
                                            onPress={() =>
                                                Linking.openURL(
                                                    brano.url_spotify!,
                                                )
                                            }
                                        />
                                    )}
                                    <BottoneIcona
                                        icona={Trash2}
                                        colore={token.pericolo}
                                        accessibilityLabel={`Rimuovi ${brano.titolo} dalla playlist`}
                                        onPress={() =>
                                            gestisciRimuovi(brano.id)
                                        }
                                    />
                                </View>
                            }
                        />
                    ))}
                </ScrollView>
            )}

            <Avviso
                messaggio={messaggioAvviso}
                onChiudi={() => setMessaggioAvviso(null)}
            />
        </View>
    );
}

export default DettaglioPlaylistSchermata;
