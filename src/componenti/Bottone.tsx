import { Pressable, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { useToken } from '../tema/useToken';

type Variante = 'primario' | 'secondario' | 'testo' | 'pericolo';

type Props = {
    etichetta: string;
    onPress: () => void;
    variante?: Variante;
    icona?: LucideIcon;
    disabilitato?: boolean;
};

// Classi complete scritte per intero (non composte a pezzi): NativeWind le
// trova leggendo il sorgente, come Tailwind.
const CLASSI_CONTENITORE: Record<Variante, string> = {
    primario: 'bg-accento-scuro px-5',
    secondario: 'border border-bordo bg-superficie px-5',
    testo: 'px-3',
    pericolo: 'px-3',
};

// primario: text-testo-su-accento, non text-testo-primario — lo sfondo
// bg-accento-scuro è fisso nei due temi, quindi anche il testo sopra deve
// esserlo (vedi src/tema/token.ts). secondario invece sta su bg-superficie,
// che è reattivo, quindi lì testo-primario resta corretto.
const CLASSI_ETICHETTA: Record<Variante, string> = {
    primario: 'text-testo-su-accento',
    secondario: 'text-testo-primario',
    testo: 'text-accento',
    pericolo: 'text-red-400',
};

function Bottone({
    etichetta,
    onPress,
    variante = 'primario',
    icona: Icona,
    disabilitato = false,
}: Props) {
    // L'icona Lucide non riceve className (non è un componente nativo
    // registrato da NativeWind): il colore va passato come prop, dagli
    // stessi token — qui dentro il componente perché useToken() è un hook
    // e dipende dal tema corrente.
    const token = useToken();
    const coloreIcona: Record<Variante, string> = {
        primario: token.testoSuAccento,
        secondario: token.testoPrimario,
        testo: token.accento,
        pericolo: token.pericolo,
    };

    return (
        <Pressable
            onPress={disabilitato ? undefined : onPress}
            disabled={disabilitato}
            accessibilityRole="button"
            accessibilityState={{ disabled: disabilitato }}
            className={`flex-row items-center justify-center rounded-bottone-lg py-3 active:opacity-70 ${
                CLASSI_CONTENITORE[variante]
            } ${disabilitato ? 'opacity-50' : ''}`}
        >
            {Icona && (
                <View className="mr-2">
                    <Icona size={18} color={coloreIcona[variante]} />
                </View>
            )}
            <Text className={`font-semibold ${CLASSI_ETICHETTA[variante]}`}>
                {etichetta}
            </Text>
        </Pressable>
    );
}

export default Bottone;
