import { Text, View } from 'react-native';

// Segnaposto: il contenuto vero arriva con lo step dedicato (CLAUDE.md,
// "Stato di avanzamento").
function ProfiloSchermata() {
    return (
        <View className="flex-1 items-center justify-center bg-sfondo">
            <Text
                accessibilityRole="header"
                className="text-2xl font-semibold text-testo-primario"
            >
                Profilo
            </Text>
        </View>
    );
}

export default ProfiloSchermata;
