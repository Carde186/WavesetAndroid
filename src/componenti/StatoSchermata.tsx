import { ActivityIndicator, Text, View } from 'react-native';

type Props = {
    tipo: 'caricamento' | 'errore' | 'vuoto';
    messaggio?: string;
};

// Schermata intera per gli stati non-contenuto (caricamento, errore, vuoto):
// finora ripetuta quasi identica in ogni schermata di dettaglio.
function StatoSchermata({ tipo, messaggio }: Props) {
    return (
        <View className="flex-1 items-center justify-center bg-sfondo px-6">
            {tipo === 'caricamento' ? (
                <ActivityIndicator className="text-accento" />
            ) : (
                <Text
                    className={`text-center ${
                        tipo === 'errore'
                            ? 'text-red-400'
                            : 'text-testo-secondario'
                    }`}
                >
                    {messaggio}
                </Text>
            )}
        </View>
    );
}

export default StatoSchermata;
