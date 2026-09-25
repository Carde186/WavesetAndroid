import { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ExternalLink, ListPlus } from 'lucide-react-native';

import { recuperaBrano } from '../api/catalogo';
import {
    aggiungiAllaPlaylist,
    creaPlaylist,
    elencaPlaylist,
} from '../api/playlist';
import type { BranoDettaglio, PlaylistSintetica } from '../api/tipi';
import Avviso from '../componenti/Avviso';
import Bottone from '../componenti/Bottone';
import CampoTesto from '../componenti/CampoTesto';
import Dialogo from '../componenti/Dialogo';
import IntestazioneDettaglio from '../componenti/IntestazioneDettaglio';
import RigaElenco from '../componenti/RigaElenco';
import StatoSchermata from '../componenti/StatoSchermata';
import type { ParametriCatalogo } from '../navigazione/tipi';
import { formattaData } from '../utilita/data';

type Props = NativeStackScreenProps<ParametriCatalogo, 'DettaglioBrano'>;

function DettaglioBranoSchermata({ route, navigation }: Props) {
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
        return <StatoSchermata tipo="caricamento" />;
    }

    if (errore || !brano) {
        return (
            <StatoSchermata
                tipo="errore"
                messaggio={errore ?? 'Brano non trovato'}
            />
        );
    }

    return (
        <View className="flex-1 bg-sfondo">
            <ScrollView contentContainerClassName="pb-24">
                {/* Il brano non ha un'immagine propria: copertina dell'album,
                    altrimenti immagine dell'artista (CLAUDE.md, "Song —
                    immagine"). Mai undefined: null = placeholder. */}
                <IntestazioneDettaglio
                    immagineUrl={
                        brano.album?.copertinaUrl ??
                        brano.artista.immagineUrl ??
                        null
                    }
                    titolo={brano.titolo}
                    sottotitolo={brano.artista.nome}
                    onPressSottotitolo={() =>
                        navigation.navigate('DettaglioArtista', {
                            artistaId: brano.artista.id,
                        })
                    }
                    righe={
                        brano.dataPubblicazione
                            ? [
                                  `Pubblicato il ${formattaData(
                                      brano.dataPubblicazione,
                                  )}`,
                              ]
                            : []
                    }
                />

                {brano.album && (
                    <Pressable
                        accessibilityRole="link"
                        className="mx-4 mt-3 self-start active:opacity-70"
                        onPress={() =>
                            navigation.navigate('DettaglioAlbum', {
                                albumId: brano.album!.id,
                            })
                        }
                    >
                        <Text className="text-accento">
                            Da {brano.album.titolo}
                        </Text>
                    </Pressable>
                )}

                <View className="mx-4 mt-4 flex-row flex-wrap gap-3">
                    <Bottone
                        etichetta="Aggiungi a playlist"
                        icona={ListPlus}
                        onPress={apriSelettorePlaylist}
                    />
                    {brano.urlSpotify && (
                        <Bottone
                            etichetta="Ascolta su Spotify"
                            variante="secondario"
                            icona={ExternalLink}
                            onPress={() => Linking.openURL(brano.urlSpotify!)}
                        />
                    )}
                </View>
            </ScrollView>

            <Dialogo
                visibile={selettoreVisibile}
                titolo="Aggiungi a playlist"
                onChiudi={() => setSelettoreVisibile(false)}
            >
                <ScrollView className="-mx-4 max-h-60">
                    {playlistDisponibili.map(playlist => (
                        <RigaElenco
                            key={playlist.id}
                            titolo={playlist.nome}
                            onPress={() => gestisciAggiungiA(playlist)}
                        />
                    ))}
                </ScrollView>

                <View className="mt-4">
                    <CampoTesto
                        valore={nomeNuovaPlaylist}
                        onCambiaTesto={setNomeNuovaPlaylist}
                        placeholder="Nuova playlist"
                    />
                </View>

                <View className="mt-4 flex-row justify-end gap-2">
                    <Bottone
                        etichetta="Annulla"
                        variante="testo"
                        onPress={() => setSelettoreVisibile(false)}
                    />
                    <Bottone
                        etichetta="Crea e aggiungi"
                        disabilitato={nomeNuovaPlaylist.trim() === ''}
                        onPress={gestisciCreaEAggiungi}
                    />
                </View>
            </Dialogo>

            <Avviso
                messaggio={messaggioAvviso}
                onChiudi={() => setMessaggioAvviso(null)}
            />
        </View>
    );
}

export default DettaglioBranoSchermata;
