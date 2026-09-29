import { useEffect, useState } from 'react';
import { Linking, View } from 'react-native';

import { recuperaCopertinaItunes } from '../api/itunes';
import type { CopertinaItunes } from '../api/tipi';
import BadgeAppleMusic from './BadgeAppleMusic';
import Immagine from './Immagine';

type Props = {
    albumId: number;
    mostraBadge?: boolean;
};

// Copertina reale (iTunes): se il backend non ha una copertina verificata
// per questo album (nessuna mappatura, iTunes irraggiungibile, match non
// più valido — vedi backend/src/itunes/copertina.js) il componente non
// rende nulla, così lo schermo che lo ospita resta sul proprio fallback
// esistente (placeholder o foto artista in IntestazioneDettaglio).
// `mostraBadge` (default true) mostra anche il badge Apple ALBUM, in
// colonna sotto l'immagine — link e destinazione diversi dal badge Apple
// TRACCIA (AnteprimaLinkAppleBrano). In Dettaglio brano, dove il badge
// traccia esiste già più sotto sulla stessa schermata, `mostraBadge={false}`
// evita due badge Apple che aprirebbero destinazioni diverse (album vs
// brano) — resta comunque solo l'immagine, mai isolata senza un modo di
// aprirla su Apple Music altrove sulla stessa schermata. Nessuna scrittura
// nel database, nessuna cache applicativa: una chiamata dal vivo ad ogni
// apertura dello schermo che lo monta. Nessun margine proprio: la
// posizione resta decisa da chi lo usa.
function AnteprimaCopertinaItunes({ albumId, mostraBadge = true }: Props) {
    const [dati, setDati] = useState<CopertinaItunes | null>(null);

    useEffect(() => {
        let attivo = true;
        setDati(null);

        recuperaCopertinaItunes(albumId)
            .then(risultato => {
                if (attivo) {
                    setDati(risultato);
                }
            })
            .catch(() => {
                // Nessuna copertina disponibile per questo album (404) o
                // iTunes irraggiungibile (502): stesso comportamento, resta
                // il fallback già presente nello schermo ospitante.
            });

        return () => {
            attivo = false;
        };
    }, [albumId]);

    if (!dati) {
        return null;
    }

    return (
        <View className="items-start gap-2">
            <Immagine
                uri={dati.artwork_url}
                className="h-16 w-16 rounded-card"
            />
            {mostraBadge && (
                <BadgeAppleMusic
                    etichetta="Apri l'album su Apple Music"
                    onPress={() => Linking.openURL(dati.link_store)}
                />
            )}
        </View>
    );
}

export default AnteprimaCopertinaItunes;
