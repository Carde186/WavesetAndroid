import { Pressable } from 'react-native';

import LogoSpotify from './LogoSpotify';

type Props = {
    onPress: () => void;
    etichetta: string;
    altezza?: number;
};

// Asset ufficiale Spotify già presente nel repo (src/assets/spotify/,
// componente LogoSpotify.tsx — stesso usato dall'anteprima ADMIN): qui
// solo reso tappabile, nessun asset nuovo, nessuno sfondo/bottone standard
// attorno — solo il logo stesso, come richiesto per stare accanto al badge
// Apple Music. Spotify non fornisce un badge "Listen on Spotify" pronto
// come quello Apple in questo repository. `altezza` più piccola del
// minimo da linee guida (70px, vedi LogoSpotify) è una scelta esplicita
// per l'accostamento al badge Apple (40px) — compensata da `hitSlop` per
// mantenere un'area di tocco comoda anche con l'immagine visibile più
// piccola. `etichetta` obbligatoria: distinta per album e brano, mai
// generica, decisa da chi lo usa.
function BottoneSpotify({ onPress, etichetta, altezza }: Props) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={etichetta}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            className="active:opacity-70"
        >
            <LogoSpotify altezza={altezza} />
        </Pressable>
    );
}

export default BottoneSpotify;
