import { Pressable, Text } from 'react-native';

type Props = {
    etichetta: string;
    selezionato: boolean;
    onPress: () => void;
};

function Pillola({ etichetta, selezionato, onPress }: Props) {
    return (
        <Pressable
            onPress={onPress}
            className={`rounded-bottone-sm border px-4 py-2 active:opacity-70 ${
                selezionato
                    ? 'border-accento-scuro bg-accento-scuro'
                    : 'border-bordo bg-superficie'
            }`}
        >
            <Text
                className={
                    selezionato
                        ? 'text-testo-primario'
                        : 'text-testo-secondario'
                }
            >
                {etichetta}
            </Text>
        </Pressable>
    );
}

export default Pillola;
