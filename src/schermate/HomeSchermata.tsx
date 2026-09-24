import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

function HomeSchermata() {
    return (
        <View style={stili.contenitore}>
            <Text variant="headlineMedium">Home</Text>
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

export default HomeSchermata;
