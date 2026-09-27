/**
 * Waveset
 * @format
 */

import './global.css';

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import RadiceNavigazione from './src/navigazione/RadiceNavigazione';
import temaNavigazione from './src/navigazione/temaNavigazione';

function App() {
    return (
        <SafeAreaProvider>
            <StatusBar barStyle="light-content" />
            <NavigationContainer theme={temaNavigazione}>
                <RadiceNavigazione />
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

export default App;
