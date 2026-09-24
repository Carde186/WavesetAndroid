import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
    ActivityIndicator,
    Chip,
    List,
    Text,
    useTheme,
} from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { recuperaArtisti, recuperaGeneri } from '../api/catalogo';
import type { ArtistaSintetico, Genere } from '../api/tipi';
import type { ParametriStackHome } from '../navigazione/tipi';

type Props = NativeStackScreenProps<ParametriStackHome, 'Home'>;

function HomeSchermata({ navigation }: Props) {
    const tema = useTheme();
    const [generi, setGeneri] = useState<Genere[]>([]);
    const [genereSelezionato, setGenereSelezionato] = useState<number | null>(
        null,
    );
    const [artisti, setArtisti] = useState<ArtistaSintetico[]>([]);
    const [inCaricamento, setInCaricamento] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);

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
        <ScrollView
            style={[
                stili.contenitore,
                { backgroundColor: tema.colors.background },
            ]}
        >
            <Text variant="titleLarge" style={stili.titoloSezione}>
                Esplora per genere
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={stili.rigaChip}>
                    {generi.map(genere => (
                        <Chip
                            key={genere.id}
                            style={stili.chip}
                            selected={genereSelezionato === genere.id}
                            onPress={() => selezionaGenere(genere.id)}
                        >
                            {genere.nome}
                        </Chip>
                    ))}
                </View>
            </ScrollView>

            {errore && <Text style={stili.errore}>{errore}</Text>}

            {inCaricamento ? (
                <ActivityIndicator style={stili.caricamento} />
            ) : (
                <List.Section>
                    {artisti.map(artista => (
                        <List.Item
                            key={artista.id}
                            title={artista.nome}
                            onPress={() =>
                                navigation.navigate('DettaglioArtista', {
                                    artistaId: artista.id,
                                })
                            }
                        />
                    ))}
                </List.Section>
            )}
        </ScrollView>
    );
}

const stili = StyleSheet.create({
    contenitore: {
        flex: 1,
    },
    titoloSezione: {
        marginTop: 16,
        marginHorizontal: 16,
    },
    rigaChip: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    chip: {
        marginRight: 8,
    },
    errore: {
        marginHorizontal: 16,
        color: 'red',
    },
    caricamento: {
        marginTop: 24,
    },
});

export default HomeSchermata;
