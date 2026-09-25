/**
 * Waveset
 * @format
 */

import './global.css';

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import RadiceNavigazione from './src/navigazione/RadiceNavigazione';
import temaNavigazione from './src/navigazione/temaNavigazione';

function App() {
    return (
        <SafeAreaProvider>
            <PaperProvider>
                <StatusBar barStyle="light-content" />
                <NavigationContainer theme={temaNavigazione}>
                    <RadiceNavigazione />
                </NavigationContainer>
            </PaperProvider>
        </SafeAreaProvider>
    );
}

export default App;
