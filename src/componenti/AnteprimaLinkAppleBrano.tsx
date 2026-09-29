import { useEffect, useState } from 'react';
import { Linking } from 'react-native';

import { recuperaLinkBranoApple } from '../api/itunes';
import BadgeAppleMusic from './BadgeAppleMusic';

type Props = {
    branoId: number;
};

// Link Apple Music ALLA TRACCIA (mai il link album — quello resta solo in
// AnteprimaCopertinaItunes, per Dettaglio album). Se il backend non ha una
// mappatura per questo brano (nessuna mappatura, seed dimostrativo) il
// componente non rende nulla — mai un badge che non porta a una traccia
// verificata. Mappatura statica lato backend: nessuna chiamata Apple da
// qui.
function AnteprimaLinkAppleBrano({ branoId }: Props) {
    const [link, setLink] = useState<string | null>(null);

    useEffect(() => {
        let attivo = true;
        setLink(null);

        recuperaLinkBranoApple(branoId)
            .then(risultato => {
                if (attivo) {
                    setLink(risultato.link_traccia);
                }
            })
            .catch(() => {});

        return () => {
            attivo = false;
        };
    }, [branoId]);

    if (!link) {
        return null;
    }

    return (
        <BadgeAppleMusic
            etichetta="Apri il brano su Apple Music"
            onPress={() => Linking.openURL(link)}
        />
    );
}

export default AnteprimaLinkAppleBrano;
