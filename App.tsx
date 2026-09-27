/**
 * Waveset
 * @format
 */

import './global.css';

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FornitoreAutenticazione } from './src/autenticazione/ContestoAutenticazione';
import RadiceNavigazione from './src/navigazione/RadiceNavigazione';
import temaNavigazione from './src/navigazione/temaNavigazione';

function App() {
    return (
        <SafeAreaProvider>
            <StatusBar barStyle="light-content" />
            <FornitoreAutenticazione>
                <NavigationContainer theme={temaNavigazione}>
                    <RadiceNavigazione />
                </NavigationContainer>
            </FornitoreAutenticazione>
        </SafeAreaProvider>
    );
}

export default App;
