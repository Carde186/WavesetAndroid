import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
    approvaEvento,
    confermaCollegamentoArtista,
    correggiEvento,
    recuperaEventoInCoda,
    scartaEvento,
} from '../../api/admin';
import type { EventoCoda } from '../../api/tipi';
import Avviso from '../../componenti/Avviso';
import Bottone from '../../componenti/Bottone';
import CampoTesto from '../../componenti/CampoTesto';
import RigaElenco from '../../componenti/RigaElenco';
import StatoSchermata from '../../componenti/StatoSchermata';
import type { ParametriStackProfilo } from '../../navigazione/tipi';
import { motiviLeggibili } from '../../utilita/motiviRevisione';

type Props = NativeStackScreenProps<
    ParametriStackProfilo,
    'DettaglioEventoCoda'
>;

// Campi editabili come stringhe (anche le coordinate: CampoTesto non ha una
// variante numerica, e per due soli campi non vale un componente a parte —
// si converte con Number() solo al salvataggio, vedi salvaCorrezioni).
type Modulo = {
    titolo: string;
    data_evento: string;
    ora_evento: string;
    luogo: string;
    citta: string;
    latitudine: string;
    longitudine: string;
};

function moduloDaEvento(evento: EventoCoda): Modulo {
    return {
        titolo: evento.titolo,
        data_evento: evento.data_evento,
        ora_evento: evento.ora_evento ?? '',
        luogo: evento.luogo ?? '',
        citta: evento.citta ?? '',
        latitudine: evento.latitudine === null ? '' : String(evento.latitudine),
        longitudine:
            evento.longitudine === null ? '' : String(evento.longitudine),
    };
}

// Dettaglio di un evento in coda (CLAUDE.md, "Cosa fa davvero l'ADMIN",
// punto 3): correggere i campi importati, confermare esplicitamente un
// collegamento artista↔attraction Ticketmaster, approvare o scartare.
// Approvare NON conferma da solo nessun collegamento (lo fa solo il
// bottone "Conferma collegamento" per riga, vedi CLAUDE.md).
function DettaglioEventoCodaSchermata({ route, navigation }: Props) {
    const { eventoId } = route.params;

    const [evento, setEvento] = useState<EventoCoda | null>(null);
    const [modulo, setModulo] = useState<Modulo | null>(null);
    const [inCaricamento, setInCaricamento] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);
    const [messaggioAvviso, setMessaggioAvviso] = useState<string | null>(null);
    const [inSalvataggio, setInSalvataggio] = useState(false);

    const ricarica = useCallback(() => {
        setInCaricamento(true);
        setErrore(null);
        recuperaEventoInCoda(eventoId)
            .then(dati => {
                setEvento(dati);
                setModulo(moduloDaEvento(dati));
            })
            .catch(() => setErrore('Impossibile caricare l’evento'))
            .finally(() => setInCaricamento(false));
    }, [eventoId]);

    useFocusEffect(ricarica);

    function aggiornaCampo(campo: keyof Modulo, valore: string) {
        setModulo(prec => (prec ? { ...prec, [campo]: valore } : prec));
    }

    async function salvaCorrezioni() {
        if (!modulo) {
            return;
        }

        const lat = modulo.latitudine.trim();
        const lon = modulo.longitudine.trim();
        const latitudine = lat === '' ? null : Number(lat.replace(',', '.'));
        const longitudine = lon === '' ? null : Number(lon.replace(',', '.'));

        if (
            (latitudine !== null && Number.isNaN(latitudine)) ||
            (longitudine !== null && Number.isNaN(longitudine))
        ) {
            setMessaggioAvviso('Coordinate non valide');
            return;
        }

        setInSalvataggio(true);
        try {
            await correggiEvento(eventoId, {
                titolo: modulo.titolo,
                data_evento: modulo.data_evento,
                ora_evento:
                    modulo.ora_evento.trim() === '' ? null : modulo.ora_evento,
                luogo: modulo.luogo.trim() === '' ? null : modulo.luogo,
                citta: modulo.citta.trim() === '' ? null : modulo.citta,
                latitudine,
                longitudine,
            });
            ricarica();
        } catch {
            setMessaggioAvviso('Impossibile salvare le correzioni');
        } finally {
            setInSalvataggio(false);
        }
    }

    async function gestisciConfermaCollegamento(artistaId: number) {
        try {
            await confermaCollegamentoArtista(eventoId, artistaId);
            ricarica();
        } catch {
            setMessaggioAvviso('Impossibile confermare il collegamento');
        }
    }

    async function gestisciApprova() {
        try {
            await approvaEvento(eventoId);
            navigation.goBack();
        } catch {
            setMessaggioAvviso('Imposta le coordinate prima di approvare');
        }
    }

    async function gestisciScarta() {
        try {
            await scartaEvento(eventoId);
            navigation.goBack();
        } catch {
            setMessaggioAvviso('Impossibile scartare l’evento');
        }
    }

    if (inCaricamento) {
        return <StatoSchermata tipo="caricamento" />;
    }

    if (errore || !evento || !modulo) {
        return (
            <StatoSchermata
                tipo="errore"
                messaggio={errore ?? 'Evento non trovato'}
            />
        );
    }

    return (
        <View className="flex-1 bg-sfondo">
            <ScrollView contentContainerClassName="p-4 pb-6">
                <Text className="mb-1 text-sm text-testo-secondario">
                    Motivo della revisione
                </Text>
                <Text className="mb-4 text-base text-testo-primario">
                    {motiviLeggibili(evento.motivo_revisione).join(', ')}
                </Text>

                <View className="gap-3">
                    <CampoTesto
                        valore={modulo.titolo}
                        onCambiaTesto={v => aggiornaCampo('titolo', v)}
                        placeholder="Titolo"
                    />
                    <CampoTesto
                        valore={modulo.data_evento}
                        onCambiaTesto={v => aggiornaCampo('data_evento', v)}
                        placeholder="Data (AAAA-MM-GG)"
                    />
                    <CampoTesto
                        valore={modulo.ora_evento}
                        onCambiaTesto={v => aggiornaCampo('ora_evento', v)}
                        placeholder="Ora locale (HH:MM:SS, facoltativa)"
                    />
                    <CampoTesto
                        valore={modulo.luogo}
                        onCambiaTesto={v => aggiornaCampo('luogo', v)}
                        placeholder="Luogo"
                    />
                    <CampoTesto
                        valore={modulo.citta}
                        onCambiaTesto={v => aggiornaCampo('citta', v)}
                        placeholder="Città"
                    />
                    <CampoTesto
                        valore={modulo.latitudine}
                        onCambiaTesto={v => aggiornaCampo('latitudine', v)}
                        placeholder="Latitudine"
                    />
                    <CampoTesto
                        valore={modulo.longitudine}
                        onCambiaTesto={v => aggiornaCampo('longitudine', v)}
                        placeholder="Longitudine"
                    />
                </View>

                <Bottone
                    etichetta="Salva correzioni"
                    variante="secondario"
                    disabilitato={inSalvataggio}
                    onPress={salvaCorrezioni}
                />

                <Text className="mb-1 mt-6 text-sm text-testo-secondario">
                    Lineup
                </Text>
                {evento.lineup.map(artista => (
                    <RigaElenco
                        key={artista.id}
                        titolo={artista.nome}
                        destra={
                            artista.collegamento_da_confermare ? (
                                <Bottone
                                    etichetta="Conferma collegamento"
                                    variante="testo"
                                    onPress={() =>
                                        gestisciConfermaCollegamento(artista.id)
                                    }
                                />
                            ) : undefined
                        }
                    />
                ))}

                <View className="mt-6 flex-row gap-3">
                    <View className="flex-1">
                        <Bottone
                            etichetta="Scarta"
                            variante="pericolo"
                            onPress={gestisciScarta}
                        />
                    </View>
                    <View className="flex-1">
                        <Bottone
                            etichetta="Approva"
                            variante="primario"
                            onPress={gestisciApprova}
                        />
                    </View>
                </View>
            </ScrollView>

            <Avviso
                messaggio={messaggioAvviso}
                onChiudi={() => setMessaggioAvviso(null)}
            />
        </View>
    );
}

export default DettaglioEventoCodaSchermata;
