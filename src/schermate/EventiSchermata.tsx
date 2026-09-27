import { Text, View } from 'react-native';

// Segnaposto: il contenuto vero arriva con lo step dedicato (CLAUDE.md,
// "Stato di avanzamento").
function EventiSchermata() {
    return (
        <View className="flex-1 items-center justify-center bg-sfondo">
            <Text
                accessibilityRole="header"
                className="text-2xl font-semibold text-testo-primario"
            >
                Eventi
            </Text>
        </View>
    );
}

export default EventiSchermata;
