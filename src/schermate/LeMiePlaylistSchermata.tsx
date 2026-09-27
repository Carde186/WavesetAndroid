import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pencil, Plus, Trash2 } from 'lucide-react-native';

import {
    creaPlaylist,
    eliminaPlaylist,
    elencaPlaylist,
    rinominaPlaylist,
} from '../api/playlist';
import type { PlaylistSintetica } from '../api/tipi';
import Avviso from '../componenti/Avviso';
import Bottone from '../componenti/Bottone';
import BottoneIcona from '../componenti/BottoneIcona';
import CampoTesto from '../componenti/CampoTesto';
import Dialogo from '../componenti/Dialogo';
import RigaElenco from '../componenti/RigaElenco';
import StatoSchermata from '../componenti/StatoSchermata';
import type { ParametriStackPlaylist } from '../navigazione/tipi';
import { TOKEN } from '../tema/token';

type Props = NativeStackScreenProps<ParametriStackPlaylist, 'LeMiePlaylist'>;

function LeMiePlaylistSchermata({ navigation }: Props) {
    const [playlist, setPlaylist] = useState<PlaylistSintetica[]>([]);
    const [inCaricamento, setInCaricamento] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);
    const [messaggioAvviso, setMessaggioAvviso] = useState<string | null>(null);

    const [dialogoVisibile, setDialogoVisibile] = useState(false);
    const [playlistInModifica, setPlaylistInModifica] =
        useState<PlaylistSintetica | null>(null);
    const [nomeInserito, setNomeInserito] = useState('');
    const [playlistDaEliminare, setPlaylistDaEliminare] =
        useState<PlaylistSintetica | null>(null);

    const ricaricaPlaylist = useCallback(() => {
        setInCaricamento(true);
        setErrore(null);
        elencaPlaylist()
            .then(setPlaylist)
            .catch(() => setErrore('Impossibile caricare le playlist'))
            .finally(() => setInCaricamento(false));
    }, []);

    useFocusEffect(
        useCallback(() => {
            ricaricaPlaylist();
        }, [ricaricaPlaylist]),
    );

    function apriDialogoCreazione() {
        setPlaylistInModifica(null);
        setNomeInserito('');
        setDialogoVisibile(true);
    }

    function apriDialogoRinomina(p: PlaylistSintetica) {
        setPlaylistInModifica(p);
        setNomeInserito(p.nome);
        setDialogoVisibile(true);
    }

    async function confermaDialogo() {
        const nome = nomeInserito.trim();

        if (!nome) {
            return;
        }

        setDialogoVisibile(false);
        try {
            if (playlistInModifica) {
                await rinominaPlaylist(playlistInModifica.id, nome);
            } else {
                await creaPlaylist(nome);
            }
        } catch {
            setMessaggioAvviso(
                playlistInModifica
                    ? 'Impossibile rinominare la playlist'
                    : 'Impossibile creare la playlist',
            );
        }
        ricaricaPlaylist();
    }

    function confermaEliminazione() {
        if (!playlistDaEliminare) {
            return;
        }

        gestisciElimina(playlistDaEliminare.id);
        setPlaylistDaEliminare(null);
    }

    function gestisciElimina(id: number) {
        // Rimozione ottimistica: sparisce subito dalla lista; se il backend
        // fallisce si ricarica, così la playlist ricompare invece di restare
        // nascosta pur esistendo ancora.
        setPlaylist(prec => prec.filter(p => p.id !== id));
        eliminaPlaylist(id).catch(() => {
            setMessaggioAvviso('Impossibile eliminare la playlist');
            ricaricaPlaylist();
        });
    }

    function contenuto() {
        if (inCaricamento) {
            return <ActivityIndicator className="mt-6 text-accento" />;
        }

        if (errore) {
            return <StatoSchermata tipo="errore" messaggio={errore} />;
        }

        if (playlist.length === 0) {
            return (
                <StatoSchermata
                    tipo="vuoto"
                    messaggio="Non hai ancora nessuna playlist"
                />
            );
        }

        return (
            <ScrollView contentContainerClassName="pb-24">
                {playlist.map(p => (
                    <RigaElenco
                        key={p.id}
                        titolo={p.nome}
                        onPress={() =>
                            navigation.navigate('DettaglioPlaylist', {
                                playlistId: p.id,
                            })
                        }
                        destra={
                            <View className="flex-row">
                                <BottoneIcona
                                    icona={Pencil}
                                    accessibilityLabel={`Rinomina ${p.nome}`}
                                    onPress={() => apriDialogoRinomina(p)}
                                />
                                <BottoneIcona
                                    icona={Trash2}
                                    colore={TOKEN.pericolo}
                                    accessibilityLabel={`Elimina ${p.nome}`}
                                    onPress={() => setPlaylistDaEliminare(p)}
                                />
                            </View>
                        }
                    />
                ))}
            </ScrollView>
        );
    }

    return (
        <View className="flex-1 bg-sfondo">
            {contenuto()}

            {/* FAB inline: un solo uso nell'app, non vale un componente. */}
            <Pressable
                onPress={apriDialogoCreazione}
                accessibilityRole="button"
                accessibilityLabel="Nuova playlist"
                className="absolute bottom-4 right-4 h-14 w-14 items-center justify-center rounded-bottone-lg bg-accento-scuro active:opacity-70"
            >
                <Plus size={24} color={TOKEN.testoPrimario} />
            </Pressable>

            <Dialogo
                visibile={dialogoVisibile}
                titolo={
                    playlistInModifica ? 'Rinomina playlist' : 'Nuova playlist'
                }
                onChiudi={() => setDialogoVisibile(false)}
            >
                <CampoTesto
                    valore={nomeInserito}
                    onCambiaTesto={setNomeInserito}
                    placeholder="Nome della playlist"
                />

                <View className="mt-4 flex-row justify-end gap-2">
                    <Bottone
                        etichetta="Annulla"
                        variante="testo"
                        onPress={() => setDialogoVisibile(false)}
                    />
                    <Bottone
                        etichetta={playlistInModifica ? 'Rinomina' : 'Crea'}
                        disabilitato={nomeInserito.trim() === ''}
                        onPress={confermaDialogo}
                    />
                </View>
            </Dialogo>

            <Dialogo
                visibile={playlistDaEliminare !== null}
                titolo="Eliminare la playlist?"
                onChiudi={() => setPlaylistDaEliminare(null)}
            >
                <Text className="text-base text-testo-secondario">
                    “{playlistDaEliminare?.nome}” verrà eliminata. I brani
                    restano nel catalogo.
                </Text>

                <View className="mt-4 flex-row justify-end gap-2">
                    <Bottone
                        etichetta="Annulla"
                        variante="testo"
                        onPress={() => setPlaylistDaEliminare(null)}
                    />
                    <Bottone
                        etichetta="Elimina"
                        variante="pericolo"
                        onPress={confermaEliminazione}
                    />
                </View>
            </Dialogo>

            <Avviso
                messaggio={messaggioAvviso}
                onChiudi={() => setMessaggioAvviso(null)}
                sopraPulsanteFlottante
            />
        </View>
    );
}

export default LeMiePlaylistSchermata;
