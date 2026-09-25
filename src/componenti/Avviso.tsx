import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';

type Props = {
    messaggio: string | null;
    onChiudi: () => void;
    durataMs?: number;
};

// Va posizionato come fratello dello ScrollView (dentro un contenitore
// flex-1), non al suo interno: essendo assoluto rispetto al genitore, dentro
// lo scroll scorrerebbe via insieme al contenuto.
function Avviso({ messaggio, onChiudi, durataMs = 3000 }: Props) {
    // Ultima versione di onChiudi senza metterla tra le dipendenze del timer:
    // una funzione inline passata dal chiamante cambia identità a ogni render
    // e riavvierebbe il conto alla rovescia ogni volta.
    const onChiudiAttuale = useRef(onChiudi);

    useEffect(() => {
        onChiudiAttuale.current = onChiudi;
    }, [onChiudi]);

    useEffect(() => {
        if (messaggio === null) {
            return;
        }

        const timer = setTimeout(() => onChiudiAttuale.current(), durataMs);

        return () => clearTimeout(timer);
    }, [messaggio, durataMs]);

    if (messaggio === null) {
        return null;
    }

    return (
        <View
            accessibilityLiveRegion="polite"
            className="absolute bottom-4 left-4 right-4 rounded-card border border-bordo bg-superficie px-4 py-3"
        >
            <Text className="text-testo-primario">{messaggio}</Text>
        </View>
    );
}

export default Avviso;
