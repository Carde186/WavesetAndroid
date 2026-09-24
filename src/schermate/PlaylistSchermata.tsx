import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

function PlaylistSchermata() {
    const tema = useTheme();

    return (
        <View
            style={[
                stili.contenitore,
                { backgroundColor: tema.colors.background },
            ]}
        >
            <Text variant="headlineMedium">Playlist</Text>
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

export default PlaylistSchermata;
