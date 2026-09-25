import { useEffect, useState } from 'react';
import { Linking, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ExternalLink, UserPlus } from 'lucide-react-native';

import { recuperaArtista } from '../api/catalogo';
import type { ArtistaDettaglio, BranoSintetico } from '../api/tipi';
import Avviso from '../componenti/Avviso';
import Bottone from '../componenti/Bottone';
import BottoneIcona from '../componenti/BottoneIcona';
import IntestazioneDettaglio from '../componenti/IntestazioneDettaglio';
import RigaElenco from '../componenti/RigaElenco';
import StatoSchermata from '../componenti/StatoSchermata';
import TitoloSezione from '../componenti/TitoloSezione';
import type { ParametriCatalogo } from '../navigazione/tipi';
import { annoDa, formattaData, formattaOra } from '../utilita/data';

type Props = NativeStackScreenProps<ParametriCatalogo, 'DettaglioArtista'>;

function DettaglioArtistaSchermata({ route, navigation }: Props) {
    const { artistaId } = route.params;

    const [artista, setArtista] = useState<ArtistaDettaglio | null>(null);
    const [inCaricamento, setInCaricamento] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);
    const [messaggioAvviso, setMessaggioAvviso] = useState<string | null>(null);

    useEffect(() => {
        setInCaricamento(true);
        setErrore(null);

        recuperaArtista(artistaId)
            .then(setArtista)
            .catch(() => setErrore('Impossibile caricare l’artista'))
            .finally(() => setInCaricamento(false));
    }, [artistaId]);

    if (inCaricamento) {
        return <StatoSchermata tipo="caricamento" />;
    }

    if (errore || !artista) {
        return (
            <StatoSchermata
                tipo="errore"
                messaggio={errore ?? 'Artista non trovato'}
            />
        );
    }

    // Un brano non ha un'immagine propria: eredita la copertina del suo
    // album, e se non ha album (o l'album non ha copertina) l'immagine
    // dell'artista (CLAUDE.md, "Song — immagine"). Il risultato è sempre
    // string | null, mai undefined: null = slot con placeholder.
    const immagineArtista = artista.immagine_url;
    const copertinaPerAlbum = new Map(
        artista.album.map(album => [album.id, album.copertina_url]),
    );

    function immagineDelBrano(brano: BranoSintetico): string | null {
        const copertina = brano.album_id
            ? copertinaPerAlbum.get(brano.album_id)
            : null;

        return copertina ?? immagineArtista;
    }

    return (
        <View className="flex-1 bg-sfondo">
            <ScrollView contentContainerClassName="pb-24">
                <IntestazioneDettaglio
                    immagineUrl={artista.immagine_url}
                    titolo={artista.nome}
                    righe={
                        artista.generi.length > 0
                            ? [artista.generi.map(g => g.nome).join(' · ')]
                            : []
                    }
                />

                {artista.bio && (
                    <Text className="mx-4 mt-4 text-base leading-6 text-testo-primario">
                        {artista.bio}
                    </Text>
                )}

                <View className="mx-4 mt-4 flex-row">
                    <Bottone
                        etichetta="Segui"
                        icona={UserPlus}
                        onPress={() =>
                            setMessaggioAvviso('Accedi per seguire gli artisti')
                        }
                    />
                </View>

                {artista.brani.length > 0 && (
                    <>
                        <TitoloSezione>Brani</TitoloSezione>
                        {artista.brani.map(brano => (
                            <RigaElenco
                                key={brano.id}
                                titolo={brano.titolo}
                                immagineUrl={immagineDelBrano(brano)}
                                onPress={() =>
                                    navigation.navigate('DettaglioBrano', {
                                        branoId: brano.id,
                                    })
                                }
                                destra={
                                    brano.url_spotify ? (
                                        <BottoneIcona
                                            icona={ExternalLink}
                                            accessibilityLabel={`Ascolta ${brano.titolo} su Spotify`}
                                            onPress={() =>
                                                Linking.openURL(
                                                    brano.url_spotify!,
                                                )
                                            }
                                        />
                                    ) : undefined
                                }
                            />
                        ))}
                    </>
                )}

                {artista.album.length > 0 && (
                    <>
                        <TitoloSezione>Album</TitoloSezione>
                        {artista.album.map(album => (
                            <RigaElenco
                                key={album.id}
                                titolo={album.titolo}
                                sottotitolo={
                                    album.data_pubblicazione
                                        ? annoDa(album.data_pubblicazione)
                                        : undefined
                                }
                                immagineUrl={album.copertina_url}
                                onPress={() =>
                                    navigation.navigate('DettaglioAlbum', {
                                        albumId: album.id,
                                    })
                                }
                            />
                        ))}
                    </>
                )}

                <TitoloSezione>Prossimi eventi</TitoloSezione>
                {artista.eventi.length === 0 ? (
                    <Text className="mx-4 mt-3 text-testo-secondario">
                        Nessun evento in programma
                    </Text>
                ) : (
                    artista.eventi.map(evento => (
                        <RigaElenco
                            key={evento.id}
                            titolo={evento.titolo}
                            sottotitolo={[
                                formattaData(evento.data_evento),
                                evento.ora_evento
                                    ? formattaOra(evento.ora_evento)
                                    : '',
                                [evento.luogo, evento.citta]
                                    .filter(Boolean)
                                    .join(', '),
                            ]
                                .filter(Boolean)
                                .join(' · ')}
                        />
                    ))
                )}
            </ScrollView>

            <Avviso
                messaggio={messaggioAvviso}
                onChiudi={() => setMessaggioAvviso(null)}
            />
        </View>
    );
}

export default DettaglioArtistaSchermata;
