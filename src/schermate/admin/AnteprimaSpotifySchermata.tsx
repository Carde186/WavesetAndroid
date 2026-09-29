import { useCallback, useState } from 'react';
import { Image, Linking, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { ErroreRichiesta } from '../../api/client';
import { recuperaAnteprimaSpotify } from '../../api/spotify';
import type { AnteprimaSpotify } from '../../api/tipi';
import Bottone from '../../componenti/Bottone';
import LogoSpotify from '../../componenti/LogoSpotify';
import RigaElenco from '../../componenti/RigaElenco';
import StatoSchermata from '../../componenti/StatoSchermata';

function formattaDurata(ms: number): string {
    const totaleSecondi = Math.round(ms / 1000);
    const minuti = Math.floor(totaleSecondi / 60);
    const secondi = totaleSecondi % 60;
    return `${minuti}:${String(secondi).padStart(2, '0')}`;
}

// Copertina/immagine Spotify: mai ritagliata (resizeMode="contain", non il
// "cover" che userebbe <Immagine> del resto dell'app) e angoli arrotondati
// con lo stesso raggio card di CLAUDE.md (8px, rounded-card) — Branding
// Guidelines Spotify: niente crop, niente overlay, angoli arrotondati sì.
function ImmagineSpotify({
    uri,
    dimensione,
}: {
    uri: string | null;
    dimensione: number;
}) {
    if (!uri) {
        return (
            <View
                className="rounded-card bg-superficie"
                style={{ width: dimensione, height: dimensione }}
            />
        );
    }
    return (
        <Image
            source={{ uri }}
            resizeMode="contain"
            className="rounded-card bg-superficie"
            style={{ width: dimensione, height: dimensione }}
        />
    );
}

// Anteprima ADMIN di sola lettura (CLAUDE.md, "Integrazioni esterne" —
// Spotify): artista e album fissi lato backend, nessuna scrittura nel
// database, nessuna relazione col catalogo/seed dimostrativo. Marchio
// Spotify in alto (LogoSpotify, asset ufficiale — vedi quel file): le
// Branding Guidelines richiedono che il marchio accompagni sempre i
// contenuti Spotify mostrati.
function AnteprimaSpotifySchermata() {
    const [dati, setDati] = useState<AnteprimaSpotify | null>(null);
    const [inCaricamento, setInCaricamento] = useState(true);
    const [nonDisponibile, setNonDisponibile] = useState(false);
    const [errore, setErrore] = useState<string | null>(null);

    const ricarica = useCallback(() => {
        setInCaricamento(true);
        setErrore(null);
        setNonDisponibile(false);
        recuperaAnteprimaSpotify()
            .then(setDati)
            .catch(e => {
                if (e instanceof ErroreRichiesta && e.stato === 503) {
                    setNonDisponibile(true);
                } else {
                    setErrore('Impossibile caricare l’anteprima Spotify');
                }
            })
            .finally(() => setInCaricamento(false));
    }, []);

    useFocusEffect(ricarica);

    if (inCaricamento) {
        return <StatoSchermata tipo="caricamento" />;
    }

    if (nonDisponibile) {
        return (
            <StatoSchermata
                tipo="vuoto"
                messaggio="Anteprima Spotify non disponibile"
            />
        );
    }

    if (errore || !dati) {
        return (
            <StatoSchermata
                tipo="errore"
                messaggio={errore ?? 'Anteprima non trovata'}
            />
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-sfondo"
            contentContainerClassName="p-4 pb-6"
        >
            {/* Zona di rispetto (Branding Guidelines: "equal to half the
                height of the icon") — qui approssimata a metà dell'altezza
                del logo intero, unico riferimento disponibile senza il
                diagramma originale delle linee guida. */}
            <View className="mb-6 items-center py-[35px]">
                <LogoSpotify />
            </View>

            <View className="mb-2 flex-row items-center gap-3">
                <ImmagineSpotify
                    uri={dati.artista.immagine_url}
                    dimensione={64}
                />
                <Text className="flex-1 text-xl font-semibold text-testo-primario">
                    {dati.artista.nome}
                </Text>
            </View>
            {dati.artista.url_spotify && (
                <Bottone
                    etichetta="Ascolta su Spotify"
                    variante="secondario"
                    onPress={() => Linking.openURL(dati.artista.url_spotify!)}
                />
            )}

            <Text className="mb-2 mt-6 text-sm text-testo-secondario">
                Release
            </Text>
            {dati.release.map(r => (
                <View key={r.id} className="mb-3 flex-row items-center gap-3">
                    <ImmagineSpotify uri={r.copertina_url} dimensione={56} />
                    <View className="flex-1">
                        <Text className="text-base text-testo-primario">
                            {r.nome}
                        </Text>
                        <Text className="text-sm text-testo-secondario">
                            {r.tipo} · {r.data_pubblicazione} · {r.numero_brani}{' '}
                            brani
                        </Text>
                    </View>
                    {r.url_spotify && (
                        <Bottone
                            etichetta="Ascolta"
                            variante="testo"
                            onPress={() => Linking.openURL(r.url_spotify!)}
                        />
                    )}
                </View>
            ))}

            <Text className="mb-1 mt-6 text-sm text-testo-secondario">
                Brani di «Electronic Generations»
            </Text>
            {dati.brani.map(b => (
                <RigaElenco
                    key={b.id}
                    titolo={`${b.numero_traccia}. ${b.titolo}`}
                    sottotitolo={formattaDurata(b.durata_ms)}
                    destra={
                        b.url_spotify ? (
                            <Bottone
                                etichetta="Ascolta"
                                variante="testo"
                                onPress={() => Linking.openURL(b.url_spotify!)}
                            />
                        ) : undefined
                    }
                />
            ))}
        </ScrollView>
    );
}

export default AnteprimaSpotifySchermata;
