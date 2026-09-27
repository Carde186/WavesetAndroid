import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { LogIn } from 'lucide-react-native';

import { ErroreRichiesta } from '../api/client';
import { useAutenticazione } from '../autenticazione/ContestoAutenticazione';
import Bottone from '../componenti/Bottone';
import CampoTesto from '../componenti/CampoTesto';

// "Accedi per continuare" (CLAUDE.md, "Schermate"): mostrata al posto di
// Playlist e Profilo quando l'utente non è loggato. Dopo il login gli stack
// sostituiscono da soli questa schermata con quella vera.
function AccediSchermata() {
    const { accedi } = useAutenticazione();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [inCorso, setInCorso] = useState(false);
    const [errore, setErrore] = useState<string | null>(null);

    async function gestisciAccedi() {
        setInCorso(true);
        setErrore(null);

        try {
            await accedi(email.trim(), password);
        } catch (e) {
            setErrore(
                e instanceof ErroreRichiesta && e.stato === 401
                    ? 'Email o password errati'
                    : 'Impossibile accedere, riprova più tardi',
            );
            setInCorso(false);
        }
    }

    return (
        <ScrollView
            className="flex-1 bg-sfondo"
            contentContainerClassName="px-4 pt-6"
            keyboardShouldPersistTaps="handled"
        >
            <Text
                accessibilityRole="header"
                className="text-2xl font-semibold text-testo-primario"
            >
                Accedi per continuare
            </Text>
            <Text className="mt-2 text-base text-testo-secondario">
                Playlist e profilo sono disponibili solo con un account.
            </Text>

            <View className="mt-6 gap-3">
                <CampoTesto
                    valore={email}
                    onCambiaTesto={setEmail}
                    placeholder="Email"
                    tipo="email"
                />
                <CampoTesto
                    valore={password}
                    onCambiaTesto={setPassword}
                    placeholder="Password"
                    tipo="password"
                />
            </View>

            {errore && (
                <Text
                    accessibilityLiveRegion="polite"
                    className="mt-3 text-red-400"
                >
                    {errore}
                </Text>
            )}

            <View className="mt-6">
                <Bottone
                    etichetta={inCorso ? 'Accesso in corso…' : 'Accedi'}
                    icona={LogIn}
                    disabilitato={inCorso || email.trim() === '' || !password}
                    onPress={gestisciAccedi}
                />
            </View>
        </ScrollView>
    );
}

export default AccediSchermata;
