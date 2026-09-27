import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';

import type { ArtistaSintetico, BranoDettaglio } from '../api/tipi';
import { LUNGHEZZA_MINIMA_RICERCA, useRicerca } from '../hooks/useRicerca';
import RigaElenco from './RigaElenco';
import TitoloSezione from './TitoloSezione';

type Props = {
    testo: string;
    onChiudi: () => void;
    onApriArtista: (artista: ArtistaSintetico) => void;
    onApriBrano: (brano: BranoDettaglio) => void;
};

// Risultati della ricerca sopra il contenuto della Home: sfondo scurito
// (la Home resta visibile sotto; toccarlo chiude la ricerca) e un pannello
// con altezza massima, così anche con molti risultati la Home si intravede.
function OverlayRicerca({
    testo,
    onChiudi,
    onApriArtista,
    onApriBrano,
}: Props) {
    const {
        testoCercato,
        risultati,
        inCaricamento,
        errore,
        troppoCorto,
        nessunRisultato,
    } = useRicerca(testo);

    function contenuto() {
        if (troppoCorto) {
            return (
                <Text className="px-4 py-3 text-testo-secondario">
                    Scrivi almeno {LUNGHEZZA_MINIMA_RICERCA} caratteri
                </Text>
            );
        }

        if (errore) {
            return <Text className="px-4 py-3 text-red-400">{errore}</Text>;
        }

        if (!risultati) {
            return <ActivityIndicator className="my-4 text-accento" />;
        }

        if (nessunRisultato && !inCaricamento) {
            return (
                <Text className="px-4 py-3 text-testo-secondario">
                    Nessun risultato per “{testoCercato}”
                </Text>
            );
        }

        return (
            <>
                {risultati.artisti.length > 0 && (
                    <>
                        <TitoloSezione>Artisti</TitoloSezione>
                        {risultati.artisti.map(artista => (
                            <RigaElenco
                                key={artista.id}
                                titolo={artista.nome}
                                immagineUrl={artista.immagine_url}
                                onPress={() => onApriArtista(artista)}
                            />
                        ))}
                    </>
                )}

                {risultati.brani.length > 0 && (
                    <>
                        <TitoloSezione>Brani</TitoloSezione>
                        {risultati.brani.map(brano => (
                            <RigaElenco
                                key={brano.id}
                                titolo={brano.titolo}
                                sottotitolo={brano.artista.nome}
                                immagineUrl={
                                    brano.album?.copertinaUrl ??
                                    brano.artista.immagineUrl
                                }
                                onPress={() => onApriBrano(brano)}
                            />
                        ))}
                    </>
                )}
            </>
        );
    }

    return (
        <View className="absolute inset-0">
            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Chiudi la ricerca"
                onPress={onChiudi}
                className="absolute inset-0 bg-black/60"
            />

            <View className="mx-3 mt-2 max-h-[70%] overflow-hidden rounded-card border border-bordo bg-superficie">
                {/* Nuova ricerca in corso con risultati già mostrati: restano
                    visibili, con un indicatore piccolo invece di svuotarli. */}
                {inCaricamento && risultati && (
                    <View className="absolute right-3 top-3 z-10">
                        <ActivityIndicator className="text-accento" />
                    </View>
                )}

                {/* "handled": con la tastiera aperta il primo tocco su un
                    risultato lo apre, invece di limitarsi a chiudere la
                    tastiera. */}
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerClassName="pb-2"
                >
                    {contenuto()}
                </ScrollView>
            </View>
        </View>
    );
}

export default OverlayRicerca;
