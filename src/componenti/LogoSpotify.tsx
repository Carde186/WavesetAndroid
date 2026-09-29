import { Image } from 'react-native';

import { usePreferenze } from '../preferenze/ContestoPreferenze';

// Asset ufficiale Spotify (Branding Guidelines — developer.spotify.com,
// sezione "Using our logo"), scaricato invariato dal media kit: PNG
// 3432×940, sfondo trasparente, mai ridisegnato né alterato. Versione nera
// e bianca, non quella verde: "The Spotify green logo should only be used
// on a black or white background, for any other background you should use
// a monochrome logo" — lo sfondo di questa schermata è bg-sfondo, che
// cambia con il tema (quasi nero in scuro, quasi bianco in chiaro), non
// puro nero/bianco.
const LOGO_NERO = require('../assets/spotify/Spotify_Full_Logo_RGB_Black.png');
const LOGO_BIANCO = require('../assets/spotify/Spotify_Full_Logo_RGB_White.png');

// Proporzioni originali del file (3432:940), mai alterate — resizeMode
// "contain" più queste dimensioni esplicite evitano qualunque stiramento.
const RAPPORTO_ASPETTO = 3432 / 940;

// Branding Guidelines: "The Spotify logo should never be smaller than 70px
// in digital." Non specificano esplicitamente se il riferimento sia altezza
// o larghezza — qui trattata come altezza (convenzione comune per i loghi
// orizzontali nei brand kit), verificabile solo confrontando con l'esempio
// visivo delle linee guida, non disponibile in questa sessione. Resta il
// default per l'uso standalone (Anteprima Spotify ADMIN); un'altezza minore
// è una scelta esplicita solo per l'uso accanto al badge Apple Music (vedi
// BottoneSpotify), non una deroga generale.
const ALTEZZA_MINIMA = 70;

type Props = {
    altezza?: number;
};

// "The black logo should be used on light colored backgrounds. The white
// logo should be used on dark colored backgrounds." — stesso stato usato
// da bg-sfondo in tutta l'app, non un calcolo di contrasto a parte.
function LogoSpotify({ altezza = ALTEZZA_MINIMA }: Props) {
    const { tema } = usePreferenze();
    const larghezza = Math.round(altezza * RAPPORTO_ASPETTO);

    return (
        <Image
            source={tema === 'scuro' ? LOGO_BIANCO : LOGO_NERO}
            resizeMode="contain"
            accessibilityLabel="Spotify"
            style={{ height: altezza, width: larghezza }}
        />
    );
}

export default LogoSpotify;
