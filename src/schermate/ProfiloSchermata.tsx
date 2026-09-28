import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAutenticazione } from '../autenticazione/ContestoAutenticazione';
import RigaElenco from '../componenti/RigaElenco';
import type { ParametriStackProfilo } from '../navigazione/tipi';

type Props = NativeStackScreenProps<ParametriStackProfilo, 'Profilo'>;

// Hub (CLAUDE.md, "Schermate": "Profilo: playlist, artisti seguiti,
// recensioni, impostazioni") — non contiene più i dati dell'account, ora
// dentro Impostazioni > Account. Playlist/Artisti seguiti/Recensioni sono
// step futuri: per ora solo il link a Impostazioni, già raggiungibile anche
// dall'icona nell'header.
function ProfiloSchermata({ navigation }: Props) {
    const { utente } = useAutenticazione();

    // Lo stack mostra questa schermata solo con un utente loggato.
    if (!utente) {
        return null;
    }

    return (
        <View className="flex-1 bg-sfondo pt-6">
            <Text
                accessibilityRole="header"
                className="mx-4 text-2xl font-semibold text-testo-primario"
            >
                Ciao, {utente.nome}
            </Text>

            <View className="mt-6">
                <RigaElenco
                    titolo="Impostazioni"
                    onPress={() => navigation.navigate('Impostazioni')}
                />
            </View>
        </View>
    );
}

export default ProfiloSchermata;
