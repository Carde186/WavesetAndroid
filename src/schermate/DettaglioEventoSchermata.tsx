import { useEffect, useState } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MapPin } from 'lucide-react-native';

import { recuperaEvento } from '../api/eventi';
import type { Evento } from '../api/tipi';
import Bottone from '../componenti/Bottone';
import IntestazioneDettaglio from '../componenti/IntestazioneDettaglio';
import MarkerEvento from '../componenti/MarkerEvento';
import RigaElenco from '../componenti/RigaElenco';
import StatoSchermata from '../componenti/StatoSchermata';
import TitoloSezione from '../componenti/TitoloSezione';
import type { ParametriCatalogo } from '../navigazione/tipi';
import { STILE_MAPPA_SCURO } from '../tema/stileMappa';
import { doveEvento, quandoEvento } from '../utilita/eventi';

type Props = NativeStackScreenProps<ParametriCatalogo, 'DettaglioEvento'>;

// Zoom della mappa del dettaglio: qualche isolato attorno al locale.
const DELTA_DETTAGLIO = 0.01;

// Link universale di Google Maps: apre l'app se installata, altrimenti il
// browser. Con le coordinate punta al luogo esatto; senza, cerca l'indirizzo
// testuale. null se non c'è nessuno dei due.
function urlGoogleMaps(evento: Evento): string | null {
    const query =
        evento.latitudine !== null && evento.longitudine !== null
            ? `${evento.latitudine},${evento.longitudine}`
            : doveEvento(evento);

    if (!query) {
        return null;
    }

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        query,
    )}`;
}

function DettaglioEventoSchermata({ route, navigation }: Props) {
    const { eventoId } = route.params;

    const [evento, setEvento] = useState<Evento | null>(null);
    const [inCaricamento, setInCaricamento] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);

    useEffect(() => {
        setInCaricamento(true);
        setErrore(null);

        recuperaEvento(eventoId)
            .then(setEvento)
            .catch(() => setErrore('Impossibile caricare l’evento'))
            .finally(() => setInCaricamento(false));
    }, [eventoId]);

    if (inCaricamento) {
        return <StatoSchermata tipo="caricamento" />;
    }

    if (errore || !evento) {
        return (
            <StatoSchermata
                tipo="errore"
                messaggio={errore ?? 'Evento non trovato'}
            />
        );
    }

    const url = urlGoogleMaps(evento);
    const dove = doveEvento(evento);

    return (
        <ScrollView
            className="flex-1 bg-sfondo"
            contentContainerClassName="pb-8"
        >
            <IntestazioneDettaglio
                titolo={evento.titolo}
                righe={[quandoEvento(evento), dove].filter(Boolean)}
            />

            {/* Mappa solo illustrativa: non si sposta né si zooma (dentro
                uno ScrollView i gesti si contenderebbero lo scroll). Per
                muoversi c'è il link a Google Maps. */}
            {evento.latitudine !== null && evento.longitudine !== null && (
                <View className="mx-4 mt-4 h-48 overflow-hidden rounded-card border border-bordo">
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={StyleSheet.absoluteFill}
                        initialRegion={{
                            latitude: evento.latitudine,
                            longitude: evento.longitudine,
                            latitudeDelta: DELTA_DETTAGLIO,
                            longitudeDelta: DELTA_DETTAGLIO,
                        }}
                        customMapStyle={STILE_MAPPA_SCURO}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        rotateEnabled={false}
                        pitchEnabled={false}
                        toolbarEnabled={false}
                    >
                        <MarkerEvento evento={evento} />
                    </MapView>
                </View>
            )}

            {url && (
                <View className="mx-4 mt-4 flex-row">
                    <Bottone
                        etichetta="Apri in Google Maps"
                        variante="secondario"
                        icona={MapPin}
                        onPress={() => Linking.openURL(url)}
                    />
                </View>
            )}

            {evento.lineup.length > 0 && (
                <>
                    <TitoloSezione>Lineup</TitoloSezione>
                    {evento.lineup.map(artista => (
                        <RigaElenco
                            key={artista.id}
                            titolo={artista.nome}
                            immagineUrl={artista.immagine_url}
                            onPress={() =>
                                navigation.navigate('DettaglioArtista', {
                                    artistaId: artista.id,
                                })
                            }
                        />
                    ))}
                </>
            )}
        </ScrollView>
    );
}

export default DettaglioEventoSchermata;
