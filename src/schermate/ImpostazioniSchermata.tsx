import { useState } from 'react';
import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LogOut } from 'lucide-react-native';

import { useAutenticazione } from '../autenticazione/ContestoAutenticazione';
import Avviso from '../componenti/Avviso';
import Bottone from '../componenti/Bottone';
import Dialogo from '../componenti/Dialogo';
import Pillola from '../componenti/Pillola';
import TitoloSezione from '../componenti/TitoloSezione';
import type { ParametriStackProfilo } from '../navigazione/tipi';
import { TEMI, usePreferenze } from '../preferenze/ContestoPreferenze';

type Props = NativeStackScreenProps<ParametriStackProfilo, 'Impostazioni'>;

// Aspetto (tema chiaro/scuro, sempre accessibile anche da anonimo) + Account
// (dati e uscita, bloccato da anonimo) — CLAUDE.md, "Schermate".
function ImpostazioniSchermata({ navigation }: Props) {
    const { tema, impostaTema } = usePreferenze();
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

    return (
        <View className="flex-1 bg-sfondo">
            <TitoloSezione>Aspetto</TitoloSezione>
            <View className="mx-4 mt-2 flex-row gap-2">
                {TEMI.map(({ valore, etichetta }) => (
                    <Pillola
                        key={valore}
                        etichetta={etichetta}
                        selezionato={tema === valore}
                        onPress={() => impostaTema(valore)}
                    />
                ))}
            </View>

            <TitoloSezione>Account</TitoloSezione>
            {utente ? (
                <View className="mx-4 mt-2">
                    <Text className="text-lg font-semibold text-testo-primario">
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

                    <View className="mt-6 items-start gap-2">
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
                </View>
            ) : (
                // Bloccata, non nascosta (CLAUDE.md: "sezione Account
                // bloccata se non loggato"): resta visibile, con un invito
                // esplicito all'accesso, mentre Aspetto sopra resta comunque
                // utilizzabile.
                <View className="mx-4 mt-2 rounded-card border border-bordo bg-superficie p-4">
                    <Text className="text-base text-testo-secondario">
                        Accedi per gestire il tuo account
                    </Text>
                    <View className="mt-3 items-start">
                        <Bottone
                            etichetta="Accedi"
                            onPress={() => navigation.navigate('Accedi')}
                        />
                    </View>
                </View>
            )}

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

export default ImpostazioniSchermata;
