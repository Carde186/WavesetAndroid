import { Image, View } from 'react-native';
import { Music } from 'lucide-react-native';

type Props = {
    uri?: string | null;
    className?: string;
};

// #9CA3AF è lo stesso valore del token testo-secondario: NativeWind non
// raggiunge le icone Lucide (non sono componenti nativi registrati da
// react-native-css-interop), quindi qui va passato come prop `color`
// invece che come className.
function Immagine({ uri, className }: Props) {
    if (!uri) {
        return (
            <View
                className={`items-center justify-center bg-superficie ${
                    className ?? ''
                }`}
            >
                <Music size={20} color="#9CA3AF" />
            </View>
        );
    }

    return <Image source={{ uri }} className={className} />;
}

export default Immagine;
