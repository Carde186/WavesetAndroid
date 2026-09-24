/**
 * Waveset
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import TabNavigator from './src/navigazione/TabNavigator';

function App() {
    const modalitaScura = useColorScheme() === 'dark';

    return (
        <SafeAreaProvider>
            <PaperProvider>
                <StatusBar
                    barStyle={modalitaScura ? 'light-content' : 'dark-content'}
                />
                <NavigationContainer>
                    <TabNavigator />
                </NavigationContainer>
            </PaperProvider>
        </SafeAreaProvider>
    );
}

export default App;
