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
import { FornitorePreferenze } from './src/preferenze/ContestoPreferenze';

function App() {
    return (
        <SafeAreaProvider>
            <StatusBar barStyle="light-content" />
            <FornitorePreferenze>
                <FornitoreAutenticazione>
                    <NavigationContainer theme={temaNavigazione}>
                        <RadiceNavigazione />
                    </NavigationContainer>
                </FornitoreAutenticazione>
            </FornitorePreferenze>
        </SafeAreaProvider>
    );
}

export default App;
