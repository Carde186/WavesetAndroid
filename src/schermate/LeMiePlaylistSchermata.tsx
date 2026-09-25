import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Dialog,
    FAB,
    IconButton,
    List,
    Portal,
    Text,
    TextInput,
    useTheme,
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pencil, Plus, Trash2 } from 'lucide-react-native';

import { creaIconaPaper } from '../componenti/iconaPaper';
import {
    creaPlaylist,
    eliminaPlaylist,
    elencaPlaylist,
    rinominaPlaylist,
} from '../api/playlist';
import type { PlaylistSintetica } from '../api/tipi';
import type { ParametriStackPlaylist } from '../navigazione/tipi';

type Props = NativeStackScreenProps<ParametriStackPlaylist, 'LeMiePlaylist'>;

const iconaRinomina = creaIconaPaper(Pencil);
const iconaElimina = creaIconaPaper(Trash2);
const iconaNuovaPlaylist = creaIconaPaper(Plus);

function creaAzioniRiga(
    playlist: PlaylistSintetica,
    onRinomina: (playlist: PlaylistSintetica) => void,
    onElimina: (id: number) => void,
) {
    return ({ color }: { color: string }) => (
        <View style={stili.azioniRiga}>
            <IconButton
                icon={iconaRinomina}
                iconColor={color}
                onPress={() => onRinomina(playlist)}
            />
            <IconButton
                icon={iconaElimina}
                iconColor={color}
                onPress={() => onElimina(playlist.id)}
            />
        </View>
    );
}

function LeMiePlaylistSchermata({ navigation }: Props) {
    const tema = useTheme();
    const [playlist, setPlaylist] = useState<PlaylistSintetica[]>([]);
    const [inCaricamento, setInCaricamento] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);

    const [dialogoVisibile, setDialogoVisibile] = useState(false);
    const [playlistInModifica, setPlaylistInModifica] =
        useState<PlaylistSintetica | null>(null);
    const [nomeInserito, setNomeInserito] = useState('');

    const ricaricaPlaylist = useCallback(() => {
        setInCaricamento(true);
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

        if (playlistInModifica) {
            await rinominaPlaylist(playlistInModifica.id, nome);
        } else {
            await creaPlaylist(nome);
        }

        setDialogoVisibile(false);
        ricaricaPlaylist();
    }

    function gestisciElimina(id: number) {
        setPlaylist(prec => prec.filter(p => p.id !== id));
        eliminaPlaylist(id).catch(() =>
            setErrore('Impossibile eliminare la playlist'),
        );
    }

    return (
        <View
            style={[
                stili.contenitore,
                { backgroundColor: tema.colors.background },
            ]}
        >
            {inCaricamento && <ActivityIndicator style={stili.caricamento} />}

            {errore && <Text style={stili.errore}>{errore}</Text>}

            {!inCaricamento && playlist.length === 0 && (
                <Text style={stili.vuoto}>Non hai ancora nessuna playlist</Text>
            )}

            {!inCaricamento && (
                <List.Section>
                    {playlist.map(p => (
                        <List.Item
                            key={p.id}
                            title={p.nome}
                            onPress={() =>
                                navigation.navigate('DettaglioPlaylist', {
                                    playlistId: p.id,
                                })
                            }
                            right={creaAzioniRiga(
                                p,
                                apriDialogoRinomina,
                                gestisciElimina,
                            )}
                        />
                    ))}
                </List.Section>
            )}

            <FAB
                icon={iconaNuovaPlaylist}
                style={stili.fab}
                onPress={apriDialogoCreazione}
            />

            <Portal>
                <Dialog
                    visible={dialogoVisibile}
                    onDismiss={() => setDialogoVisibile(false)}
                >
                    <Dialog.Title>
                        {playlistInModifica
                            ? 'Rinomina playlist'
                            : 'Nuova playlist'}
                    </Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            value={nomeInserito}
                            onChangeText={setNomeInserito}
                            placeholder="Nome della playlist"
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDialogoVisibile(false)}>
                            Annulla
                        </Button>
                        <Button onPress={confermaDialogo}>Conferma</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

const stili = StyleSheet.create({
    contenitore: {
        flex: 1,
    },
    caricamento: {
        marginTop: 24,
    },
    errore: {
        marginHorizontal: 16,
        marginTop: 16,
        color: 'red',
    },
    vuoto: {
        marginHorizontal: 16,
        marginTop: 24,
    },
    azioniRiga: {
        flexDirection: 'row',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
    },
});

export default LeMiePlaylistSchermata;
