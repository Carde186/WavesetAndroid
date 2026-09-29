import { useCallback, useState } from 'react';
import { Image, Linking, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { recuperaAnteprimaDeezer } from '../../api/deezer';
import type { AnteprimaDeezer } from '../../api/tipi';
import Bottone from '../../componenti/Bottone';
import LogoDeezer from '../../componenti/LogoDeezer';
import RigaElenco from '../../componenti/RigaElenco';
import StatoSchermata from '../../componenti/StatoSchermata';

function formattaDurata(secondi: number): string {
    const minuti = Math.floor(secondi / 60);
    const resto = secondi % 60;
    return `${minuti}:${String(resto).padStart(2, '0')}`;
}

// Stessa logica di ImmagineSpotify (vedi AnteprimaSpotifySchermata): mai
// ritagliata, angoli arrotondati con lo stesso raggio card di CLAUDE.md.
function ImmagineDeezer({
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
// Deezer): schermata separata da quella Spotify, artista e album fissi lato
// backend, nessuna scrittura nel database. Il logo Deezer (obbligatorio per
// le loro guidelines) è in cima, come per Spotify.
function AnteprimaDeezerSchermata() {
    const [dati, setDati] = useState<AnteprimaDeezer | null>(null);
    const [inCaricamento, setInCaricamento] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);

    const ricarica = useCallback(() => {
        setInCaricamento(true);
        setErrore(null);
        recuperaAnteprimaDeezer()
            .then(setDati)
            .catch(() => setErrore('Impossibile caricare l’anteprima Deezer'))
            .finally(() => setInCaricamento(false));
    }, []);

    useFocusEffect(ricarica);

    if (inCaricamento) {
        return <StatoSchermata tipo="caricamento" />;
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
            <View className="mb-6 items-center py-[35px]">
                <LogoDeezer />
            </View>

            <View className="mb-2 flex-row items-center gap-3">
                <ImmagineDeezer uri={dati.artista.foto_url} dimensione={64} />
                <Text className="flex-1 text-xl font-semibold text-testo-primario">
                    {dati.artista.nome}
                </Text>
            </View>
            {dati.artista.url_deezer && (
                <Bottone
                    etichetta="Ascolta su Deezer"
                    variante="secondario"
                    onPress={() => Linking.openURL(dati.artista.url_deezer!)}
                />
            )}

            {dati.album ? (
                <>
                    <Text className="mb-2 mt-6 text-sm text-testo-secondario">
                        Album
                    </Text>
                    <View className="mb-3 flex-row items-center gap-3">
                        <ImmagineDeezer
                            uri={dati.album.copertina_url}
                            dimensione={56}
                        />
                        <Text className="flex-1 text-base text-testo-primario">
                            {dati.album.titolo}
                        </Text>
                        {dati.album.url_deezer && (
                            <Bottone
                                etichetta="Ascolta"
                                variante="testo"
                                onPress={() =>
                                    Linking.openURL(dati.album!.url_deezer!)
                                }
                            />
                        )}
                    </View>
                </>
            ) : (
                // Il backend restituisce album=null SOLO quando Deezer
                // dichiara esplicitamente il dato assente (non per un
                // guasto: quello fa fallire l'intera richiesta, vedi
                // catch sopra) — quindi qui è sempre un vuoto legittimo,
                // mai un errore mascherato.
                <Text className="mt-6 text-sm text-testo-secondario">
                    Album non trovato
                </Text>
            )}

            {dati.brani.length > 0 && (
                <>
                    <Text className="mb-1 mt-6 text-sm text-testo-secondario">
                        Brani
                    </Text>
                    {dati.brani.map((b, indice) => (
                        <RigaElenco
                            key={b.id}
                            titolo={`${indice + 1}. ${b.titolo}`}
                            sottotitolo={formattaDurata(b.durata_secondi)}
                            destra={
                                b.url_deezer ? (
                                    <Bottone
                                        etichetta="Ascolta"
                                        variante="testo"
                                        onPress={() =>
                                            Linking.openURL(b.url_deezer!)
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

export default AnteprimaDeezerSchermata;
