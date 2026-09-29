import { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { elencaCodaEventi } from '../../api/admin';
import type { EventoCoda } from '../../api/tipi';
import RigaElenco from '../../componenti/RigaElenco';
import StatoSchermata from '../../componenti/StatoSchermata';
import type { ParametriStackProfilo } from '../../navigazione/tipi';
import { motiviLeggibili } from '../../utilita/motiviRevisione';

type Props = NativeStackScreenProps<ParametriStackProfilo, 'CodaEventi'>;

// Coda di revisione Ticketmaster (CLAUDE.md, "Cosa fa davvero l'ADMIN",
// punto 3): eventi importati che non si sono pubblicati automaticamente.
// Ricaricata a ogni focus, come LeMiePlaylist: dopo aver approvato o
// scartato un evento dal Dettaglio e tornato indietro, la lista deve
// riflettere la coda aggiornata, non quella al primo caricamento.
function CodaEventiSchermata({ navigation }: Props) {
    const [coda, setCoda] = useState<EventoCoda[]>([]);
    const [inCaricamento, setInCaricamento] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);

    const ricarica = useCallback(() => {
        setInCaricamento(true);
        setErrore(null);
        elencaCodaEventi()
            .then(setCoda)
            .catch(() => setErrore('Impossibile caricare la coda'))
            .finally(() => setInCaricamento(false));
    }, []);

    useFocusEffect(ricarica);

    if (inCaricamento) {
        return <StatoSchermata tipo="caricamento" />;
    }

    if (errore) {
        return <StatoSchermata tipo="errore" messaggio={errore} />;
    }

    if (coda.length === 0) {
        return (
            <StatoSchermata
                tipo="vuoto"
                messaggio="Nessun evento da rivedere"
            />
        );
    }

    return (
        <ScrollView contentContainerClassName="pb-6">
            {coda.map(evento => (
                <RigaElenco
                    key={evento.id}
                    titolo={evento.titolo}
                    sottotitolo={`${evento.data_evento} · ${motiviLeggibili(evento.motivo_revisione).join(', ')}`}
                    onPress={() =>
                        navigation.navigate('DettaglioEventoCoda', {
                            eventoId: evento.id,
                        })
                    }
                />
            ))}
        </ScrollView>
    );
}

export default CodaEventiSchermata;
