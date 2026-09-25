import { Pressable } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { TOKEN } from '../tema/token';

type Props = {
    icona: LucideIcon;
    // Obbligatoria: un bottone solo-icona senza etichetta testuale non è
    // altrimenti leggibile da uno screen reader.
    accessibilityLabel: string;
    onPress: () => void;
    // Il colore va passato come prop e non come className: l'icona Lucide
    // non è un componente nativo registrato da NativeWind.
    colore?: string;
};

function BottoneIcona({
    icona: Icona,
    accessibilityLabel,
    onPress,
    colore = TOKEN.testoSecondario,
}: Props) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            className="h-10 w-10 items-center justify-center rounded-full active:opacity-60"
        >
            <Icona size={20} color={colore} />
        </Pressable>
    );
}

export default BottoneIcona;
