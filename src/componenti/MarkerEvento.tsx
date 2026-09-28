import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { Music } from 'lucide-react-native';

import type { Evento } from '../api/tipi';
import { TOKEN } from '../tema/token';

type Props = {
    evento: Evento;
    onPress?: () => void;
};

// Marker personalizzato: foto del primo artista del lineup (il lineup non ha
// ruoli in v1, quindi "primo" = primo in ordine alfabetico) e un badge "+N"
// se gli artisti sono di più. Gli eventi senza coordinate non hanno marker.
//
// Su Android un marker personalizzato non resta una view "viva": viene
// convertito in un'immagine statica. Se la foto arriva dalla rete dopo quella
// conversione, il marker resta vuoto. tracksViewChanges={true} fa rigenerare
// l'immagine a ogni cambiamento: lo si tiene attivo solo finché la foto non
// è caricata (tenerlo sempre acceso pesa molto con tanti marker).
function MarkerEvento({ evento, onPress }: Props) {
    const [fotoPronta, setFotoPronta] = useState(false);

    if (evento.latitudine === null || evento.longitudine === null) {
        return null;
    }

    const primoArtista = evento.lineup[0];
    const uri = primoArtista?.immagine_url ?? null;
    const altri = evento.lineup.length - 1;

    return (
        <Marker
            coordinate={{
                latitude: evento.latitudine,
                longitude: evento.longitudine,
            }}
            title={evento.titolo}
            onPress={onPress}
            tracksViewChanges={uri !== null && !fotoPronta}
        >
            <View className="p-1">
                <View className="h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-accento bg-superficie">
                    {uri ? (
                        <Image
                            source={{ uri }}
                            className="h-full w-full"
                            onLoad={() => setFotoPronta(true)}
                            onError={() => setFotoPronta(true)}
                        />
                    ) : (
                        <Music size={20} color={TOKEN.testoSecondario} />
                    )}
                </View>
                {altri > 0 && (
                    <View className="absolute right-0 top-0 rounded-full bg-accento-scuro px-1.5">
                        <Text className="text-xs font-semibold text-testo-primario">
                            +{altri}
                        </Text>
                    </View>
                )}
            </View>
        </Marker>
    );
}

export default MarkerEvento;
