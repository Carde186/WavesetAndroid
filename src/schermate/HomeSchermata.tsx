import { useCallback, useLayoutEffect, useState } from 'react';
import {
    ActivityIndicator,
    BackHandler,
    Keyboard,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
    recuperaArtisti,
    recuperaGeneri,
    recuperaNovita,
} from '../api/catalogo';
import { useAutenticazione } from '../autenticazione/ContestoAutenticazione';
import CartaNovita from '../componenti/CartaNovita';
import OverlayRicerca from '../componenti/OverlayRicerca';
import Pillola from '../componenti/Pillola';
import RigaElenco from '../componenti/RigaElenco';
import TitoloSezione from '../componenti/TitoloSezione';
import type {
    ArtistaSintetico,
    BranoDettaglio,
    Evento,
    Genere,
} from '../api/tipi';
import { mostraCampoRicercaHeader } from '../navigazione/CampoRicercaHeader';
import { useRicercaHome } from '../navigazione/ContestoRicercaHome';
import LogoHeaderLeft from '../navigazione/LogoHeaderLeft';
import type { ParametriStackHome } from '../navigazione/tipi';
import { riepilogoEvento } from '../utilita/eventi';

type Props = NativeStackScreenProps<ParametriStackHome, 'Home'>;

// A ricerca aperta il campo prende anche il posto del logo.
function NienteHeaderLeft() {
    return null;
}

function HomeSchermata({ navigation }: Props) {
    const { utente } = useAutenticazione();
    const [braniRecenti, setBraniRecenti] = useState<BranoDettaglio[]>([]);
    const [eventiNovita, setEventiNovita] = useState<Evento[]>([]);
    const [novitaPersonalizzate, setNovitaPersonalizzate] = useState(false);
    const [generi, setGeneri] = useState<Genere[]>([]);
    const [genereSelezionato, setGenereSelezionato] = useState<number | null>(
        null,
    );
    const [artisti, setArtisti] = useState<ArtistaSintetico[]>([]);
    const [inCaricamento, setInCaricamento] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);
    const { aperta, testo, chiudi } = useRicercaHome();

    // L'header cambia solo quando la ricerca si apre o si chiude, mai a ogni
    // tasto: i componenti passati sono di modulo e leggono il testo dal
    // contesto. Se si ripassasse qui una funzione nuova a ogni render, React
    // rimonterebbe il campo e la tastiera si chiuderebbe a ogni lettera.
    // A ricerca chiusa headerTitle torna quello nativo ("Home").
    useLayoutEffect(() => {
        navigation.setOptions(
            aperta
                ? {
                      headerLeft: NienteHeaderLeft,
                      headerTitle: mostraCampoRicercaHeader,
                  }
                : { headerLeft: LogoHeaderLeft, headerTitle: undefined },
        );
    }, [navigation, aperta]);

    // Con la ricerca aperta, il tasto Indietro di Android la chiude invece di
    // uscire dall'app. Attivo solo mentre la Home è la schermata visibile.
    useFocusEffect(
        useCallback(() => {
            if (!aperta) {
                return;
            }

            const sottoscrizione = BackHandler.addEventListener(
                'hardwareBackPress',
                () => {
                    chiudi();
                    return true;
                },
            );

            return () => sottoscrizione.remove();
        }, [aperta, chiudi]),
    );

    // Unico caricamento, rieseguito quando la Home torna visibile (un follow
    // fatto in un dettaglio cambia feed e suggerimenti), quando cambia il
    // genere e al login/logout (la callback cambia con `utente`).
    useFocusEffect(
        useCallback(() => {
            // Sezione secondaria: se fallisce, resta semplicemente vuota
            // (nascosta) invece di mostrare un errore che competerebbe con
            // il contenuto principale della Home.
            recuperaNovita()
                .then(novita => {
                    setBraniRecenti(novita.brani);
                    setEventiNovita(novita.eventi);
                    setNovitaPersonalizzate(novita.personalizzato);
                })
                .catch(() => {});

            setErrore(null);
            recuperaGeneri()
                .then(setGeneri)
                .catch(() => setErrore('Impossibile caricare i generi'));

            setInCaricamento(true);
            recuperaArtisti(genereSelezionato ?? undefined, utente !== null)
                .then(setArtisti)
                .catch(() => setErrore('Impossibile caricare gli artisti'))
                .finally(() => setInCaricamento(false));
        }, [genereSelezionato, utente]),
    );

    function selezionaGenere(id: number) {
        setGenereSelezionato(prec => (prec === id ? null : id));
    }

    return (
        <View className="flex-1 bg-sfondo">
            <ScrollView className="flex-1">
                {(braniRecenti.length > 0 || eventiNovita.length > 0) && (
                    <TitoloSezione>
                        {novitaPersonalizzate
                            ? 'Novità dagli artisti che segui'
                            : 'Ultime uscite'}
                    </TitoloSezione>
                )}

                {braniRecenti.length > 0 && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="px-4 py-3"
                    >
                        {braniRecenti.map(brano => (
                            <CartaNovita
                                key={brano.id}
                                titolo={brano.titolo}
                                artistaNome={brano.artista.nome}
                                immagineUrl={
                                    brano.album?.copertinaUrl ??
                                    brano.artista.immagineUrl
                                }
                                onPress={() =>
                                    navigation.navigate('DettaglioBrano', {
                                        branoId: brano.id,
                                    })
                                }
                            />
                        ))}
                    </ScrollView>
                )}

                {/* Solo nel feed personalizzato: prossimi eventi con almeno
                    un artista seguito (CLAUDE.md, "brani/eventi recenti"). */}
                {eventiNovita.length > 0 && (
                    <>
                        <Text className="mx-4 mt-1 text-sm font-semibold text-testo-secondario">
                            Prossimi eventi
                        </Text>
                        {eventiNovita.map(evento => (
                            <RigaElenco
                                key={evento.id}
                                titolo={evento.titolo}
                                sottotitolo={riepilogoEvento(evento)}
                                immagineUrl={
                                    evento.lineup[0]?.immagine_url ?? null
                                }
                                onPress={() =>
                                    navigation.navigate('DettaglioEvento', {
                                        eventoId: evento.id,
                                    })
                                }
                            />
                        ))}
                    </>
                )}

                <TitoloSezione>Esplora per genere</TitoloSezione>
                {utente && (
                    <Text className="mx-4 mt-1 text-sm text-testo-secondario">
                        Artisti che non segui ancora
                    </Text>
                )}

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row gap-2 px-4 py-3">
                        {generi.map(genere => (
                            <Pillola
                                key={genere.id}
                                etichetta={genere.nome}
                                selezionato={genereSelezionato === genere.id}
                                onPress={() => selezionaGenere(genere.id)}
                            />
                        ))}
                    </View>
                </ScrollView>

                {errore && <Text className="mx-4 text-red-400">{errore}</Text>}

                {/* Lo spinner solo al primo caricamento: negli aggiornamenti
                    (ritorno sulla Home, cambio genere) la lista resta
                    visibile finché arriva quella nuova. */}
                {inCaricamento && artisti.length === 0 ? (
                    <ActivityIndicator className="mt-6 text-accento" />
                ) : !inCaricamento && artisti.length === 0 ? (
                    <Text className="mx-4 mt-3 text-testo-secondario">
                        {utente
                            ? 'Segui già tutti gli artisti di questo genere'
                            : 'Nessun artista in questo genere'}
                    </Text>
                ) : (
                    <View>
                        {artisti.map(artista => (
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
                    </View>
                )}
            </ScrollView>

            {/* La tastiera si chiude aprendo un dettaglio: al ritorno la
                ricerca è ancora aperta con i risultati, ma senza tastiera. */}
            {aperta && (
                <OverlayRicerca
                    testo={testo}
                    onChiudi={chiudi}
                    onApriArtista={artista => {
                        Keyboard.dismiss();
                        navigation.navigate('DettaglioArtista', {
                            artistaId: artista.id,
                        });
                    }}
                    onApriBrano={brano => {
                        Keyboard.dismiss();
                        navigation.navigate('DettaglioBrano', {
                            branoId: brano.id,
                        });
                    }}
                />
            )}
        </View>
    );
}

export default HomeSchermata;
