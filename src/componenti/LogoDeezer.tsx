import { Image } from 'react-native';

import { usePreferenze } from '../preferenze/ContestoPreferenze';

// Asset ufficiali Deezer, forniti già scaricati (non ricreati né ridisegnati
// in questa sessione): PNG 714×200, sfondo trasparente. Logo-Horizontal-
// Light.png ha la scritta bianca (per tema scuro), Logo-Horizontal-Dark.png
// la scritta nera (per tema chiaro) — nomi Deezer riferiti al colore del
// testo, non al tema in cui si usano, letti con attenzione per non
// invertirli.
const LOGO_TEMA_SCURO = require('../assets/deezer/Logo-Horizontal-Light.png');
const LOGO_TEMA_CHIARO = require('../assets/deezer/Logo-Horizontal-Dark.png');

// Proporzioni originali del file (714:200), mai alterate.
const RAPPORTO_ASPETTO = 714 / 200;
const ALTEZZA = 40;

function LogoDeezer() {
    const { tema } = usePreferenze();
    const larghezza = Math.round(ALTEZZA * RAPPORTO_ASPETTO);

    return (
        <Image
            source={tema === 'scuro' ? LOGO_TEMA_SCURO : LOGO_TEMA_CHIARO}
            resizeMode="contain"
            accessibilityLabel="Deezer"
            style={{ height: ALTEZZA, width: larghezza }}
        />
    );
}

export default LogoDeezer;
