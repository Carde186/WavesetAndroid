import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
    recuperaArtisti,
    recuperaBraniRecenti,
    recuperaGeneri,
} from '../api/catalogo';
import CartaNovita from '../componenti/CartaNovita';
import Pillola from '../componenti/Pillola';
import RigaElenco from '../componenti/RigaElenco';
import TitoloSezione from '../componenti/TitoloSezione';
import type { ArtistaSintetico, BranoDettaglio, Genere } from '../api/tipi';
import type { ParametriStackHome } from '../navigazione/tipi';

type Props = NativeStackScreenProps<ParametriStackHome, 'Home'>;

function HomeSchermata({ navigation }: Props) {
    const [braniRecenti, setBraniRecenti] = useState<BranoDettaglio[]>([]);
    const [generi, setGeneri] = useState<Genere[]>([]);
    const [genereSelezionato, setGenereSelezionato] = useState<number | null>(
        null,
    );
    const [artisti, setArtisti] = useState<ArtistaSintetico[]>([]);
    const [inCaricamento, setInCaricamento] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);

    useEffect(() => {
        // Sezione secondaria: se fallisce, resta semplicemente vuota
        // (nascosta) invece di mostrare un errore che competerebbe con il
        // contenuto principale della Home.
        recuperaBraniRecenti()
            .then(setBraniRecenti)
            .catch(() => {});
    }, []);

    useEffect(() => {
        recuperaGeneri()
            .then(setGeneri)
            .catch(() => setErrore('Impossibile caricare i generi'));
    }, []);

    useEffect(() => {
        setInCaricamento(true);
        setErrore(null);

        recuperaArtisti(genereSelezionato ?? undefined)
            .then(setArtisti)
            .catch(() => setErrore('Impossibile caricare gli artisti'))
            .finally(() => setInCaricamento(false));
    }, [genereSelezionato]);

    function selezionaGenere(id: number) {
        setGenereSelezionato(prec => (prec === id ? null : id));
    }

    return (
        <ScrollView className="flex-1 bg-sfondo">
            {braniRecenti.length > 0 && (
                <>
                    <TitoloSezione>Novità</TitoloSezione>
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
                </>
            )}

            <TitoloSezione>Esplora per genere</TitoloSezione>

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

            {inCaricamento ? (
                <ActivityIndicator className="mt-6 text-accento" />
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
    );
}

export default HomeSchermata;
