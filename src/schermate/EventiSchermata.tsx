import { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { recuperaEventi } from '../api/eventi';
import type { FiltroEventi } from '../api/eventi';
import type { Evento } from '../api/tipi';
import { useAutenticazione } from '../autenticazione/ContestoAutenticazione';
import MarkerEvento from '../componenti/MarkerEvento';
import MenuTipoMappa from '../componenti/MenuTipoMappa';
import Pillola from '../componenti/Pillola';
import RigaElenco from '../componenti/RigaElenco';
import type { ParametriStackEventi } from '../navigazione/tipi';
import { usePreferenze } from '../preferenze/ContestoPreferenze';
import { propsMappa } from '../tema/stileMappa';
import { riepilogoEvento } from '../utilita/eventi';

type Props = NativeStackScreenProps<ParametriStackEventi, 'Eventi'>;

// Vista iniziale: Italia intera (CLAUDE.md, "mappa eventi, vista Tutti,
// centrata sull'Italia"). Appena arrivano gli eventi la mappa si adatta ai
// loro marker.
const REGIONE_ITALIA = {
    latitude: 42.5,
    longitude: 12.5,
    latitudeDelta: 11,
    longitudeDelta: 11,
};

// Margine (in punti) tra i marker e i bordi della mappa quando la si adatta.
const MARGINE_MARKER = { top: 60, right: 60, bottom: 60, left: 60 };

function EventiSchermata({ navigation }: Props) {
    const { utente } = useAutenticazione();
    const mappa = useRef<MapView>(null);

    // "Tutti" è il predefinito anche da loggati: la mappa non è mai vuota,
    // anche per chi non segue ancora nessuno.
    const [filtro, setFiltro] = useState<FiltroEventi>('tutti');
    const [eventi, setEventi] = useState<Evento[]>([]);
    const [inCaricamento, setInCaricamento] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);
    const [mappaPronta, setMappaPronta] = useState(false);
    const [menuAperto, setMenuAperto] = useState(false);
    const { tipoMappa, impostaTipoMappa } = usePreferenze();

    // "Che seguo" esiste solo da loggati: dopo un logout si torna a "Tutti"
    // (altrimenti il backend risponderebbe 401).
    const filtroEffettivo: FiltroEventi = utente ? filtro : 'tutti';

    // Ricaricati anche a ogni ritorno sulla schermata: un follow fatto in un
    // dettaglio cambia "Che seguo".
    useFocusEffect(
        useCallback(() => {
            setInCaricamento(true);
            setErrore(null);

            recuperaEventi(filtroEffettivo)
                .then(setEventi)
                .catch(() => setErrore('Impossibile caricare gli eventi'))
                .finally(() => setInCaricamento(false));
        }, [filtroEffettivo]),
    );

    // Adatta la mappa ai marker. Serve la mappa già pronta (onMapReady),
    // altrimenti su Android fitToCoordinates non conosce ancora le
    // dimensioni della view e non ha effetto.
    useEffect(() => {
        const coordinate = eventi
            .filter(e => e.latitudine !== null && e.longitudine !== null)
            .map(e => ({
                latitude: e.latitudine as number,
                longitude: e.longitudine as number,
            }));

        if (!mappaPronta || coordinate.length === 0) {
            return;
        }

        if (coordinate.length === 1) {
            // Con un solo punto fitToCoordinates zoomerebbe al massimo.
            mappa.current?.animateToRegion({
                ...coordinate[0],
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
            });
            return;
        }

        mappa.current?.fitToCoordinates(coordinate, {
            edgePadding: MARGINE_MARKER,
            animated: true,
        });
    }, [eventi, mappaPronta]);

    function apriEvento(evento: Evento) {
        navigation.navigate('DettaglioEvento', { eventoId: evento.id });
    }

    function contenutoElenco() {
        if (errore) {
            return <Text className="mx-4 mt-3 text-red-400">{errore}</Text>;
        }

        if (inCaricamento && eventi.length === 0) {
            return <ActivityIndicator className="mt-6 text-accento" />;
        }

        if (eventi.length === 0) {
            return (
                <Text className="mx-4 mt-3 text-testo-secondario">
                    {filtroEffettivo === 'seguiti'
                        ? 'Nessun evento degli artisti che segui'
                        : 'Nessun evento in programma'}
                </Text>
            );
        }

        return eventi.map(evento => (
            <RigaElenco
                key={evento.id}
                titolo={evento.titolo}
                sottotitolo={riepilogoEvento(evento)}
                immagineUrl={evento.lineup[0]?.immagine_url ?? null}
                onPress={() => apriEvento(evento)}
            />
        ));
    }

    return (
        <View className="flex-1 bg-sfondo">
            <View className="h-[45%] border-b border-bordo">
                <MapView
                    ref={mappa}
                    provider={PROVIDER_GOOGLE}
                    style={StyleSheet.absoluteFill}
                    initialRegion={REGIONE_ITALIA}
                    {...propsMappa(tipoMappa)}
                    toolbarEnabled={false}
                    onMapReady={() => setMappaPronta(true)}
                    onPress={() => setMenuAperto(false)}
                >
                    {/* Tap sul marker: direttamente al Dettaglio evento. */}
                    {eventi.map(evento => (
                        <MarkerEvento
                            key={evento.id}
                            evento={evento}
                            onPress={() => apriEvento(evento)}
                        />
                    ))}
                </MapView>

                <MenuTipoMappa
                    tipo={tipoMappa}
                    aperto={menuAperto}
                    onApriChiudi={() => setMenuAperto(aperto => !aperto)}
                    onScegli={tipo => {
                        impostaTipoMappa(tipo);
                        setMenuAperto(false);
                    }}
                />
            </View>

            {utente && (
                <View className="flex-row gap-2 px-4 py-3">
                    <Pillola
                        etichetta="Che seguo"
                        selezionato={filtroEffettivo === 'seguiti'}
                        onPress={() => setFiltro('seguiti')}
                    />
                    <Pillola
                        etichetta="Tutti"
                        selezionato={filtroEffettivo === 'tutti'}
                        onPress={() => setFiltro('tutti')}
                    />
                </View>
            )}

            <ScrollView contentContainerClassName="pb-8">
                {contenutoElenco()}
            </ScrollView>
        </View>
    );
}

export default EventiSchermata;
