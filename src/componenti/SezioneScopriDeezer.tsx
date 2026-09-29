import { useCallback, useState } from 'react';
import { Linking, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { recuperaScopriDeezer } from '../api/deezer';
import type { ScopriDeezer } from '../api/tipi';
import Bottone from './Bottone';
import LogoDeezer from './LogoDeezer';
import RigaElenco from './RigaElenco';

function formattaDurata(secondi: number): string {
    const minuti = Math.floor(secondi / 60);
    const resto = secondi % 60;
    return `${minuti}:${String(resto).padStart(2, '0')}`;
}

// Sezione "In evidenza su Deezer" in Home, solo per utenti autenticati (vedi
// HomeSchermata: `{utente ? <SezioneScopriDeezer /> : <CartaAccediDeezer />}`,
// per chi non ha fatto accesso c'è l'invito in CartaAccediDeezer.tsx). Il
// nome del file/componente è rimasto "SezioneScopriDeezer" (identificatore
// interno, non testo mostrato): l'etichetta in interfaccia è cambiata da
// "Scopri" a "In evidenza" perché mostra un solo artista preselezionato
// lato backend, non una ricerca o un'esplorazione del catalogo Deezer.
// Riusa la stessa demo Deezer fissa già mostrata all'ADMIN
// (AnteprimaDeezerSchermata), ma senza immagini: il backend
// (routes/deezer.js) non le invia nemmeno, perché Deezer vieta di
// conservare/cacheare le immagini (FAQ Deezer — vedi CLAUDE.md) e il
// componente <Image> di React Native su Android le cachea comunque in
// autonomia (Fresco), fuori dal nostro controllo. Contorno (bordo +
// intestazione con logo) per distinguerla visivamente dalle righe del
// catalogo locale sopra. Niente Segui/Aggiungi a playlist: questi risultati
// non hanno un id del catalogo locale.
function SezioneScopriDeezer() {
    const [dati, setDati] = useState<ScopriDeezer | null>(null);
    const [inCaricamento, setInCaricamento] = useState(true);
    const [errore, setErrore] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setInCaricamento(true);
            setErrore(false);
            recuperaScopriDeezer()
                .then(setDati)
                .catch(() => setErrore(true))
                .finally(() => setInCaricamento(false));
        }, []),
    );

    return (
        <View className="mx-4 mb-6 mt-6 rounded-card border border-bordo bg-superficie">
            <View className="flex-row items-center justify-between border-b border-bordo px-4 py-3">
                <Text className="text-sm font-semibold text-testo-primario">
                    In evidenza su Deezer
                </Text>
                <LogoDeezer />
            </View>

            {inCaricamento ? (
                <Text className="px-4 py-4 text-sm text-testo-secondario">
                    Caricamento...
                </Text>
            ) : errore || !dati ? (
                <Text className="px-4 py-4 text-sm text-testo-secondario">
                    Impossibile caricare i suggerimenti Deezer al momento
                </Text>
            ) : (
                <>
                    <RigaElenco
                        titolo={dati.artista.nome}
                        sottotitolo={dati.album?.titolo}
                        destra={
                            dati.artista.url_deezer ? (
                                <Bottone
                                    etichetta="Apri"
                                    variante="testo"
                                    onPress={() =>
                                        Linking.openURL(
                                            dati.artista.url_deezer!,
                                        )
                                    }
                                />
                            ) : undefined
                        }
                    />

                    {dati.brani.length === 0 ? (
                        <Text className="px-4 py-4 text-sm text-testo-secondario">
                            Nessun brano trovato al momento
                        </Text>
                    ) : (
                        dati.brani.map(brano => (
                            <RigaElenco
                                key={brano.id}
                                titolo={brano.titolo}
                                sottotitolo={formattaDurata(
                                    brano.durata_secondi,
                                )}
                                destra={
                                    brano.url_deezer ? (
                                        <Bottone
                                            etichetta="Ascolta"
                                            variante="testo"
                                            onPress={() =>
                                                Linking.openURL(
                                                    brano.url_deezer!,
                                                )
                                            }
                                        />
                                    ) : undefined
                                }
                            />
                        ))
                    )}

                    <Text className="px-4 py-3 text-xs text-testo-secondario">
                        Dati forniti da Deezer
                    </Text>
                </>
            )}
        </View>
    );
}

export default SezioneScopriDeezer;
