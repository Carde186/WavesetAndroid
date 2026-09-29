import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

import type { ParametriTab } from '../navigazione/tipi';
import Bottone from './Bottone';

// Sostituisce "In evidenza su Deezer" in Home per chi non ha fatto accesso
// (vedi HomeSchermata): stesso spazio nel layout, ma nessuna chiamata a
// Deezer né al catalogo locale, solo un invito ad accedere — puramente
// statico, senza useEffect/fetch.
//
// Il bottone "Accedi" naviga verso la schermata "Accedi" dentro lo stack
// Profilo (route già esistente in ParametriStackProfilo, vedi
// navigazione/tipi.ts — nessuna route nuova). Non basta portare in primo
// piano il solo tab (`navigate('ProfiloStack')`, come fa AvatarUtente):
// quello stack, da anonimo, contiene sia "Accedi" sia "Impostazioni"
// (sempre raggiungibile, anche da anonimo — vedi ProfiloStack.tsx), e
// React Navigation ricorda l'ultima schermata visitata in quello stack.
// Se l'utente era arrivato su Impostazioni (raggiungibile dall'icona
// ingranaggio nell'header, presente anche sopra Accedi) e poi tocca questo
// bottone, portare in primo piano il solo tab riaprirebbe Impostazioni, non
// il login — da qui la necessità di specificare anche la schermata.
// Nessun bottone "Registrati": nel progetto non esiste ancora nessuna
// schermata/flusso di registrazione da collegare.
function CartaAccediDeezer() {
    const navigation = useNavigation<NavigationProp<ParametriTab>>();

    return (
        <View className="mx-4 mb-6 mt-6 rounded-card border border-bordo bg-superficie p-4">
            <Text className="text-sm font-semibold text-testo-primario">
                Scopri musica dal vivo
            </Text>
            <Text className="mt-1 text-sm text-testo-secondario">
                Accedi per vedere la selezione Deezer e creare playlist con i
                brani del catalogo dell'app.
            </Text>
            <View className="mt-3 items-start">
                <Bottone
                    etichetta="Accedi"
                    onPress={() =>
                        navigation.navigate('ProfiloStack', {
                            screen: 'Accedi',
                        })
                    }
                />
            </View>
        </View>
    );
}

export default CartaAccediDeezer;
