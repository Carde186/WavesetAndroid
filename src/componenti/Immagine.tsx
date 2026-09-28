import { Image, View } from 'react-native';
import { Music } from 'lucide-react-native';

import { useToken } from '../tema/useToken';

type Props = {
    uri?: string | null;
    className?: string;
};

function Immagine({ uri, className }: Props) {
    // NativeWind non raggiunge le icone Lucide (non sono componenti nativi
    // registrati da react-native-css-interop): il colore va passato come
    // prop `color`, letto dal tema corrente invece che fisso, perché lo
    // sfondo bg-superficie dietro cambia con il tema.
    const token = useToken();

    if (!uri) {
        return (
            <View
                className={`items-center justify-center bg-superficie ${
                    className ?? ''
                }`}
            >
                <Music size={20} color={token.testoSecondario} />
            </View>
        );
    }

    return <Image source={{ uri }} className={className} />;
}

export default Immagine;
