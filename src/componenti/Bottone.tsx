import { Pressable, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { TOKEN } from '../tema/token';

type Variante = 'primario' | 'secondario' | 'testo';

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
    primario: 'bg-accento px-5',
    secondario: 'border border-bordo bg-superficie px-5',
    testo: 'px-3',
};

const CLASSI_ETICHETTA: Record<Variante, string> = {
    primario: 'text-testo-primario',
    secondario: 'text-testo-primario',
    testo: 'text-accento',
};

// L'icona Lucide non riceve className (non è un componente nativo registrato
// da NativeWind): il colore va passato come prop, dagli stessi token.
const COLORE_ICONA: Record<Variante, string> = {
    primario: TOKEN.testoPrimario,
    secondario: TOKEN.testoPrimario,
    testo: TOKEN.accento,
};

function Bottone({
    etichetta,
    onPress,
    variante = 'primario',
    icona: Icona,
    disabilitato = false,
}: Props) {
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
                    <Icona size={18} color={COLORE_ICONA[variante]} />
                </View>
            )}
            <Text className={`font-semibold ${CLASSI_ETICHETTA[variante]}`}>
                {etichetta}
            </Text>
        </Pressable>
    );
}

export default Bottone;
