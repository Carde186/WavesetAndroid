import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import type { Theme } from '@react-navigation/native';

import type { Token } from '../tema/token';

// Tema per NavigationContainer (header, sfondo schermate senza className,
// colori di default della tab bar), ricalcolato ogni volta che cambia il
// tema dell'app. `scuro` sceglie solo la base di partenza di React
// Navigation (alcuni componenti della libreria, es. i picker di sistema,
// guardano il flag `dark` del tema) — i colori veri e propri sono sempre i
// nostri token, mai quelli della base.
function creaTemaNavigazione(token: Token, scuro: boolean): Theme {
    const base = scuro ? DarkTheme : DefaultTheme;

    return {
        ...base,
        dark: scuro,
        colors: {
            ...base.colors,
            primary: token.accento,
            background: token.sfondo,
            card: token.superficie,
            text: token.testoPrimario,
            border: token.bordo,
            notification: token.accento,
        },
    };
}

export default creaTemaNavigazione;
