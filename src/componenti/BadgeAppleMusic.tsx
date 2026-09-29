import { Image, Pressable } from 'react-native';

// Asset ufficiale Apple ("Listen on Apple Music"), fornito già scaricato
// (src/assets/itunes/badge.svg, non ricreato né ridisegnato in questa
// sessione) e convertito fedelmente in PNG — il progetto non ha un
// transform Metro per importare .svg come componente (metro.config.js,
// verificato: nessun react-native-svg-transformer), stessa soluzione già
// in uso per i loghi Spotify/Deezer (PNG, non SVG). L'SVG originale resta
// nel repository; l'app usa badge.png. Conversione fatta con Chrome
// headless a scala 6x rispetto alle dimensioni native dell'SVG
// (140.62×41pt), sfondo trasparente conservato, nessuna modifica a
// grafica/colori/proporzioni.
//
// Solo variante nera: le linee guida Apple la danno per adatta anche a
// sfondi neri/scuri ("the standard badge works on black or white
// backgrounds"), coerente con bg-sfondo (#0B0B0F) — l'app non ha ancora un
// tema chiaro attivo (Impostazioni, non implementate). "Never create your
// own Apple Music badge or change the artwork in any way" (linee guida
// Apple): l'immagine non viene mai ritagliata/ridisegnata, solo
// ridimensionata mantenendo le proporzioni originali.
const BADGE = require('../assets/itunes/badge.png');

// Dimensioni reali del PNG esportato (846×246), stesso rapporto dell'SVG
// originale (140.62:41).
const RAPPORTO_ASPETTO = 846 / 246;
// Minimo Apple per l'uso digitale: 30px. 40 è coerente con l'altezza già
// usata per LogoDeezer.
const ALTEZZA = 40;

type Props = {
    onPress: () => void;
    etichetta: string;
};

// `etichetta` obbligatoria: questo badge appare sia per il link ALBUM
// (AnteprimaCopertinaItunes) sia per il link TRACCIA
// (AnteprimaLinkAppleBrano), a volte sulla stessa schermata (Dettaglio
// brano) — un'unica etichetta fissa li avrebbe resi indistinguibili per
// chi usa uno screen reader.
function BadgeAppleMusic({ onPress, etichetta }: Props) {
    const larghezza = Math.round(ALTEZZA * RAPPORTO_ASPETTO);

    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={etichetta}
            className="active:opacity-70"
        >
            <Image
                source={BADGE}
                resizeMode="contain"
                style={{ height: ALTEZZA, width: larghezza }}
            />
        </Pressable>
    );
}

export default BadgeAppleMusic;
