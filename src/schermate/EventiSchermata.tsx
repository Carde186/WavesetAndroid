import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

function EventiSchermata() {
    return (
        <View style={stili.contenitore}>
            <Text variant="headlineMedium">Eventi</Text>
        </View>
    );
}

const stili = StyleSheet.create({
    contenitore: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default EventiSchermata;
