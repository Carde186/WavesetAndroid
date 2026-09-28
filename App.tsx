/**
 * Waveset
 * @format
 */

import './global.css';

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, View } from 'react-native';
import { vars } from 'nativewind';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FornitoreAutenticazione } from './src/autenticazione/ContestoAutenticazione';
import RadiceNavigazione from './src/navigazione/RadiceNavigazione';
import creaTemaNavigazione from './src/navigazione/temaNavigazione';
import {
    FornitorePreferenze,
    usePreferenze,
} from './src/preferenze/ContestoPreferenze';
import { useToken } from './src/tema/useToken';

// Componente separato (non dentro App) perché usePreferenze()/useToken()
// devono stare DENTRO FornitorePreferenze, che li fornisce.
function ContenutoApp() {
    const { tema } = usePreferenze();
    const token = useToken();
    const scuro = tema === 'scuro';

    return (
        // Le variabili CSS impostate qui, in cima all'albero, sono quello
        // che fa funzionare il tema in tutta l'app: ogni classe NativeWind
        // già scritta nelle schermate (bg-sfondo, text-testo-primario,
        // border-bordo...) punta a var(--colore-x) in tailwind.config.js,
        // quindi cambia da sola quando cambiano questi valori — senza
        // toccare un solo file di schermata. Icone Lucide, tema di
        // React Navigation e StatusBar non passano da qui: sono valori
        // JavaScript puri, letti a parte con useToken()/creaTemaNavigazione.
        <View
            className="flex-1"
            style={vars({
                'colore-sfondo': token.sfondo,
                'colore-superficie': token.superficie,
                'colore-accento': token.accento,
                'colore-accento-scuro': token.accentoScuro,
                'colore-testo-primario': token.testoPrimario,
                'colore-testo-secondario': token.testoSecondario,
                'colore-bordo': token.bordo,
                'colore-testo-su-accento': token.testoSuAccento,
            })}
        >
            <StatusBar barStyle={scuro ? 'light-content' : 'dark-content'} />
            <FornitoreAutenticazione>
                <NavigationContainer theme={creaTemaNavigazione(token, scuro)}>
                    <RadiceNavigazione />
                </NavigationContainer>
            </FornitoreAutenticazione>
        </View>
    );
}

function App() {
    return (
        <SafeAreaProvider>
            <FornitorePreferenze>
                <ContenutoApp />
            </FornitorePreferenze>
        </SafeAreaProvider>
    );
}

export default App;
