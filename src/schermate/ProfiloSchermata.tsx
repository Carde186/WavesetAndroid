import { useState } from 'react';
import { Text, View } from 'react-native';
import { LogOut } from 'lucide-react-native';

import { useAutenticazione } from '../autenticazione/ContestoAutenticazione';
import Avviso from '../componenti/Avviso';
import Bottone from '../componenti/Bottone';
import Dialogo from '../componenti/Dialogo';

// Versione minima: dati dell'account e logout. Playlist, artisti seguiti e
// impostazioni arrivano con i rispettivi step.
function ProfiloSchermata() {
    const { utente, esci, esciDaTutti } = useAutenticazione();

    const [confermaVisibile, setConfermaVisibile] = useState(false);
    const [messaggioAvviso, setMessaggioAvviso] = useState<string | null>(null);

    async function confermaEsciDaTutti() {
        setConfermaVisibile(false);
        try {
            await esciDaTutti();
        } catch {
            setMessaggioAvviso('Impossibile uscire da tutti i dispositivi');
        }
    }

    // Lo stack mostra questa schermata solo con un utente loggato.
    if (!utente) {
        return null;
    }

    return (
        <View className="flex-1 bg-sfondo px-4 pt-6">
            <Text
                accessibilityRole="header"
                className="text-2xl font-semibold text-testo-primario"
            >
                {utente.nome}
            </Text>
            <Text className="mt-1 text-base text-testo-secondario">
                {utente.email}
            </Text>
            {utente.ruolo === 'ADMIN' && (
                <Text className="mt-1 text-sm text-accento">
                    Amministratore
                </Text>
            )}

            <View className="mt-8 items-start gap-2">
                <Bottone
                    etichetta="Esci"
                    variante="secondario"
                    icona={LogOut}
                    onPress={esci}
                />
                <Bottone
                    etichetta="Esci da tutti i dispositivi"
                    variante="pericolo"
                    onPress={() => setConfermaVisibile(true)}
                />
            </View>

            <Dialogo
                visibile={confermaVisibile}
                titolo="Uscire da tutti i dispositivi?"
                onChiudi={() => setConfermaVisibile(false)}
            >
                <Text className="text-base text-testo-secondario">
                    Verrai disconnesso da questo telefono e da tutti gli altri
                    dispositivi su cui hai effettuato l’accesso.
                </Text>

                <View className="mt-4 flex-row justify-end gap-2">
                    <Bottone
                        etichetta="Annulla"
                        variante="testo"
                        onPress={() => setConfermaVisibile(false)}
                    />
                    <Bottone
                        etichetta="Esci ovunque"
                        variante="pericolo"
                        onPress={confermaEsciDaTutti}
                    />
                </View>
            </Dialogo>

            <Avviso
                messaggio={messaggioAvviso}
                onChiudi={() => setMessaggioAvviso(null)}
            />
        </View>
    );
}

export default ProfiloSchermata;
