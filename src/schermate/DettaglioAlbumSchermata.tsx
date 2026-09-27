import { useEffect, useState } from 'react';
import { Linking, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ExternalLink } from 'lucide-react-native';

import { recuperaAlbum } from '../api/catalogo';
import type { AlbumDettaglio } from '../api/tipi';
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

            {album.brani.length > 0 && (
                <>
                    <TitoloSezione>Tracce</TitoloSezione>
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
