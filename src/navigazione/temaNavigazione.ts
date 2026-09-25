import { DarkTheme } from '@react-navigation/native';
import type { Theme } from '@react-navigation/native';

import { TOKEN } from '../tema/token';

// Tema fisso scuro per NavigationContainer (header, sfondo schermate senza
// className, colori di default della tab bar). Il toggle chiaro/scuro
// vero e proprio arriva con lo step Impostazioni: per ora un solo tema,
// come nel resto dell'app.
const temaNavigazione: Theme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: TOKEN.accento,
        background: TOKEN.sfondo,
        card: TOKEN.superficie,
        text: TOKEN.testoPrimario,
        border: TOKEN.bordo,
        notification: TOKEN.accento,
    },
};

export default temaNavigazione;
