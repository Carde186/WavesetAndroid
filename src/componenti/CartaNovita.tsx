import { Pressable, Text, View } from 'react-native';
import { Music } from 'lucide-react-native';

import Immagine from './Immagine';

type Props = {
    titolo: string;
    artistaNome: string;
    immagineUrl?: string | null;
    onPress?: () => void;
};

// Solo brani per ora: il tipo "evento" arriverà con l'entità Event (step
// Eventi + mappa), insieme all'icona che distingue i due tipi di card.
function CartaNovita({ titolo, artistaNome, immagineUrl, onPress }: Props) {
    return (
        <Pressable onPress={onPress} className="mr-3 w-36 active:opacity-70">
            <View className="relative">
                <Immagine
                    uri={immagineUrl}
                    className="h-36 w-36 rounded-card bg-superficie"
                />
                <View className="absolute bottom-1 right-1 rounded-full bg-sfondo/80 p-1">
                    <Music size={14} color="#F5F5F7" />
                </View>
            </View>
            <Text
                numberOfLines={1}
                className="mt-2 text-sm text-testo-primario"
            >
                {titolo}
            </Text>
            <Text numberOfLines={1} className="text-xs text-testo-secondario">
                {artistaNome}
            </Text>
        </Pressable>
    );
}

export default CartaNovita;
