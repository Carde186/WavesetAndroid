import { usePreferenze } from '../preferenze/ContestoPreferenze';
import { TOKEN_CHIARO, TOKEN_SCURO } from './token';
import type { Token } from './token';

// Per i punti dell'app che non passano da NativeWind/className (icone
// Lucide, tabBarStyle di React Navigation): restituisce la palette giusta
// per il tema corrente. I colori delle classi NativeWind (bg-sfondo,
// text-testo-primario, ...) si aggiornano invece da soli, tramite le
// variabili CSS impostate in App.tsx — non serve questo hook per quelli.
export function useToken(): Token {
    const { tema } = usePreferenze();

    return tema === 'chiaro' ? TOKEN_CHIARO : TOKEN_SCURO;
}
