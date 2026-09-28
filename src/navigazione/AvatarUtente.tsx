import { Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { User } from 'lucide-react-native';

import { useAutenticazione } from '../autenticazione/ContestoAutenticazione';
import { TOKEN } from '../tema/token';
import type { ParametriTab } from './tipi';

type Props = {
    // Sul tab Profilo il tocco sarebbe ridondante: solo indicatore.
    soloIndicatore?: boolean;
};

// Indicatore di login in alto a destra. Loggato: iniziale del nome su
// accento-scuro (stesso sfondo dei bottoni primari, 5,23:1 con il testo).
// Anonimo: icona utente grigia. Il tocco apre il tab Profilo, che mostra il
// profilo o "Accedi per continuare" a seconda del login.
function AvatarUtente({ soloIndicatore = false }: Props) {
    const { utente } = useAutenticazione();
    const navigation = useNavigation<NavigationProp<ParametriTab>>();

    const iniziale = utente?.nome.trim().charAt(0).toUpperCase() || '?';

    const cerchio = utente ? (
        <View className="h-8 w-8 items-center justify-center rounded-full bg-accento-scuro">
            <Text className="text-sm font-semibold text-testo-primario">
                {iniziale}
            </Text>
        </View>
    ) : (
        <View className="h-8 w-8 items-center justify-center rounded-full border border-bordo">
            <User size={18} color={TOKEN.testoSecondario} />
        </View>
    );

    const descrizione = utente ? `Profilo di ${utente.nome}` : 'Accedi';

    if (soloIndicatore) {
        return (
            <View
                accessibilityRole="image"
                accessibilityLabel={
                    utente
                        ? `Accesso effettuato come ${utente.nome}`
                        : 'Non hai effettuato l’accesso'
                }
            >
                {cerchio}
            </View>
        );
    }

    // navigate verso un tab: dagli stack annidati la richiesta risale fino
    // al tab navigator, che ha la route ProfiloStack.
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={descrizione}
            hitSlop={8}
            onPress={() => navigation.navigate('ProfiloStack')}
            className="active:opacity-70"
        >
            {cerchio}
        </Pressable>
    );
}

// Come per la lente: all'header si passano funzioni di modulo che
// restituiscono l'elemento, non il componente, perché il native stack chiama
// le opzioni header* dentro il proprio render e gli hook di AvatarUtente
// (useAutenticazione, useNavigation) finirebbero contati lì.
export function mostraAvatarHeaderRight() {
    return <AvatarUtente />;
}

export function mostraAvatarSoloIndicatore() {
    return <AvatarUtente soloIndicatore />;
}

export default AvatarUtente;
