import { TextInput } from 'react-native';

type Props = {
    valore: string;
    onCambiaTesto: (testo: string) => void;
    placeholder: string;
};

function CampoTesto({ valore, onCambiaTesto, placeholder }: Props) {
    return (
        <TextInput
            value={valore}
            onChangeText={onCambiaTesto}
            placeholder={placeholder}
            accessibilityLabel={placeholder}
            className="rounded-bottone-sm border border-bordo bg-sfondo px-3 py-2 text-base text-testo-primario placeholder:text-testo-secondario"
        />
    );
}

export default CampoTesto;
