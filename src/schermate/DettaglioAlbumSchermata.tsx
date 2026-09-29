import { useEffect, useState } from 'react';
import { Linking, ScrollView, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ExternalLink } from 'lucide-react-native';

import { recuperaAlbum } from '../api/catalogo';
import type { AlbumDettaglio } from '../api/tipi';
import AnteprimaCopertinaItunes from '../componenti/AnteprimaCopertinaItunes';
import AnteprimaLinkSpotifyAlbum from '../componenti/AnteprimaLinkSpotifyAlbum';
import BottoneIcona from '../componenti/BottoneIcona';
import IntestazioneDettaglio from '../componenti/IntestazioneDettaglio';
import RigaElenco from '../componenti/RigaElenco';
import StatoSchermata from '../componenti/StatoSchermata';
import TitoloSezione from '../componenti/TitoloSezione';
import type { ParametriCatalogo } from '../navigazione/tipi';
import { formattaData } from '../utilita/data';

type Props = NativeStackScreenProps<ParametriCatalogo, 'DettaglioAlbum'>;

function DettaglioAlbumSchermata({ route, navigation }: Props) {
    const { albumId } = route.params;

    const [album, setAlbum] = useState<AlbumDettaglio | null>(null);
    const [inCaricamento, setInCaricamento] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);

    useEffect(() => {
        setInCaricamento(true);
        setErrore(null);

        recuperaAlbum(albumId)
            .then(setAlbum)
            .catch(() => setErrore('Impossibile caricare l’album'))
            .finally(() => setInCaricamento(false));
    }, [albumId]);

    if (inCaricamento) {
        return <StatoSchermata tipo="caricamento" />;
    }

    if (errore || !album) {
        return (
            <StatoSchermata
                tipo="errore"
                messaggio={errore ?? 'Album non trovato'}
            />
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-sfondo"
            contentContainerClassName="pb-8"
        >
            <IntestazioneDettaglio
                immagineUrl={album.copertinaUrl}
                titolo={album.titolo}
                sottotitolo={album.artista.nome}
                onPressSottotitolo={() =>
                    navigation.navigate('DettaglioArtista', {
                        artistaId: album.artista.id,
                    })
                }
                righe={
                    album.dataPubblicazione
                        ? [
                              `Pubblicato il ${formattaData(
                                  album.dataPubblicazione,
                              )}`,
                          ]
                        : []
                }
            />

            {/* Solo per i pochi album reali con una mappatura verificata
                (CLAUDE.md, "Catalogo reale"): entrambi non rendono nulla
                per il seed dimostrativo, resta il placeholder sopra.
                Colonna: copertina, poi badge Apple Music, poi logo
                Spotify — stesso ordine ovunque appaiano insieme. */}
            <View className="mx-4 mt-4 items-start gap-2">
                <AnteprimaCopertinaItunes albumId={album.id} />
                <AnteprimaLinkSpotifyAlbum albumId={album.id} />
            </View>

            {album.brani.length > 0 && (
                <>
                    <TitoloSezione>Tracce</TitoloSezione>
                    {/* Solo il bottone Spotify per riga (quando
                        brano.url_spotify esiste già, invariato). Ogni riga
                        ha l'id del brano (AlbumDettaglio.brani[].id), quindi
                        tecnicamente potrebbe risolvere anche il proprio
                        link Apple — ma un badge Apple Music intero non
                        entra in una riga di lista da 48px (stesso motivo
                        per cui qui non c'è nemmeno la foto): niente da
                        "simulare" riusando il link dell'album, il vero
                        link per traccia resta solo nel Dettaglio brano
                        dedicato, dove il badge ha spazio. */}
                    {album.brani.map(brano => (
                        <RigaElenco
                            key={brano.id}
                            titolo={brano.titolo}
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
                                            Linking.openURL(brano.url_spotify!)
                                        }
                                    />
                                ) : undefined
                            }
                        />
                    ))}
                </>
            )}
        </ScrollView>
    );
}

export default DettaglioAlbumSchermata;
