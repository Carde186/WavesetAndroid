import { Pressable, Text, View } from 'react-native';

import Immagine from './Immagine';

type Props = {
    // Stessa semantica di RigaElenco: undefined = niente slot immagine,
    // null = slot con placeholder, stringa = immagine.
    immagineUrl?: string | null;
    titolo: string;
    sottotitolo?: string;
    onPressSottotitolo?: () => void;
    righe?: string[];
};

// Testata comune a Dettaglio artista/brano/album: immagine a sinistra,
// titolo, sottotitolo (link se tappabile) e righe di metadati a destra.
function IntestazioneDettaglio({
    immagineUrl,
    titolo,
    sottotitolo,
    onPressSottotitolo,
    righe = [],
}: Props) {
    return (
        <View className="flex-row items-center px-4 pt-4">
            {immagineUrl !== undefined && (
                <Immagine
                    uri={immagineUrl}
                    className="mr-4 h-28 w-28 rounded-card"
                />
            )}
            <View className="flex-1">
                <Text
                    accessibilityRole="header"
                    className="text-2xl font-semibold text-testo-primario"
                >
                    {titolo}
                </Text>
                {sottotitolo !== undefined &&
                    (onPressSottotitolo ? (
                        <Pressable
                            onPress={onPressSottotitolo}
                            accessibilityRole="link"
                            className="active:opacity-70"
                        >
                            <Text className="mt-1 text-base text-accento">
                                {sottotitolo}
                            </Text>
                        </Pressable>
                    ) : (
                        <Text className="mt-1 text-base text-testo-secondario">
                            {sottotitolo}
                        </Text>
                    ))}
                {righe.map(riga => (
                    <Text
                        key={riga}
                        className="mt-1 text-sm text-testo-secondario"
                    >
                        {riga}
                    </Text>
                ))}
            </View>
        </View>
    );
}

export default IntestazioneDettaglio;
