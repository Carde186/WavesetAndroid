import { useEffect, useState } from 'react';
import { Linking } from 'react-native';

import { recuperaLinkAlbumSpotify } from '../api/spotify';
import BottoneSpotify from './BottoneSpotify';

type Props = {
    albumId: number;
};

// Altezza compatta, coerente con il badge Apple Music (40px) di cui questo
// componente è pensato per stare accanto (Dettaglio album): deroga
// esplicita al minimo da linee guida di LogoSpotify (70px, riservato
// all'anteprima ADMIN standalone), compensata da hitSlop in BottoneSpotify.
const ALTEZZA_ACCANTO_A_BADGE = 28;

// Link Spotify ALL'ALBUM (mai un link di un brano). Se il backend non ha
// una mappatura per questo album (nessuna mappatura, seed dimostrativo) il
// componente non rende nulla — nessun bottone isolato senza una
// destinazione verificata. Mappatura statica lato backend: nessuna
// chiamata Spotify da qui, solo una richiesta al nostro backend. Nessun
// margine proprio: la posizione (accanto al badge Apple Music) resta
// decisa da chi lo usa.
function AnteprimaLinkSpotifyAlbum({ albumId }: Props) {
    const [link, setLink] = useState<string | null>(null);

    useEffect(() => {
        let attivo = true;
        setLink(null);

        recuperaLinkAlbumSpotify(albumId)
            .then(risultato => {
                if (attivo) {
                    setLink(risultato.link_store);
                }
            })
            .catch(() => {});

        return () => {
            attivo = false;
        };
    }, [albumId]);

    if (!link) {
        return null;
    }

    return (
        <BottoneSpotify
            etichetta="Apri l'album su Spotify"
            altezza={ALTEZZA_ACCANTO_A_BADGE}
            onPress={() => Linking.openURL(link)}
        />
    );
}

export default AnteprimaLinkSpotifyAlbum;
