import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Settings } from 'lucide-react-native';

import BottoneIcona from '../componenti/BottoneIcona';
import AvatarUtente from './AvatarUtente';
import type { ParametriStackProfilo } from './tipi';

// Header del tab Profilo, sia da loggato sia da anonimo: avatar solo
// indicatore (il tocco sul tab Profilo sarebbe ridondante) + icona
// Impostazioni. È l'unico punto d'ingresso a Impostazioni — deve restare
// raggiungibile anche da anonimo (CLAUDE.md: "sezione Aspetto sempre
// accessibile"), quindi vive nell'header, non dentro la sola ProfiloSchermata
// (che da anonimo non viene nemmeno montata).
function ProfiloHeaderRight() {
    const navigation =
        useNavigation<NativeStackNavigationProp<ParametriStackProfilo>>();

    return (
        <View className="flex-row items-center gap-2">
            <AvatarUtente soloIndicatore />
            <BottoneIcona
                icona={Settings}
                accessibilityLabel="Impostazioni"
                onPress={() => navigation.navigate('Impostazioni')}
            />
        </View>
    );
}

// Come per lente e avatar: funzione di modulo che restituisce l'elemento,
// non il componente passato direttamente, perché il native stack chiama le
// opzioni header* dentro il proprio render (vedi AvatarUtente.tsx).
export function mostraProfiloHeaderRight() {
    return <ProfiloHeaderRight />;
}

export default ProfiloHeaderRight;
