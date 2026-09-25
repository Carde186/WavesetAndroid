import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import Immagine from './Immagine';

type Props = {
    titolo: string;
    sottotitolo?: string;
    immagineUrl?: string | null;
    destra?: ReactNode;
    onPress?: () => void;
};

// immagineUrl assente (undefined) = niente slot immagine, riga come prima.
// immagineUrl presente (stringa o null) = slot immagine mostrato, con
// placeholder se null.
function RigaElenco({
    titolo,
    sottotitolo,
    immagineUrl,
    destra,
    onPress,
}: Props) {
    return (
        <Pressable
            onPress={onPress}
            className="flex-row items-center justify-between border-b border-bordo px-4 py-3 active:opacity-70"
        >
            <View className="flex-1 flex-row items-center">
                {immagineUrl !== undefined && (
                    <Immagine
                        uri={immagineUrl}
                        className="mr-3 h-12 w-12 rounded-card"
                    />
                )}
                <View className="flex-1">
                    <Text className="text-base text-testo-primario">
                        {titolo}
                    </Text>
                    {sottotitolo && (
                        <Text className="mt-0.5 text-sm text-testo-secondario">
                            {sottotitolo}
                        </Text>
                    )}
                </View>
            </View>
            {destra}
        </Pressable>
    );
}

export default RigaElenco;
