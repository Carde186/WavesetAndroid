import { TextInput } from 'react-native';

type Tipo = 'testo' | 'email' | 'password';

type Props = {
    valore: string;
    onCambiaTesto: (testo: string) => void;
    placeholder: string;
    tipo?: Tipo;
};

// Email e password: niente maiuscola automatica né correttore (cambierebbero
// il valore digitato), tastiera adatta e suggerimenti di compilazione
// automatica del sistema.
const PROPS_PER_TIPO = {
    testo: {},
    email: {
        keyboardType: 'email-address',
        autoCapitalize: 'none',
        autoCorrect: false,
        autoComplete: 'email',
        textContentType: 'emailAddress',
    },
    password: {
        secureTextEntry: true,
        autoCapitalize: 'none',
        autoCorrect: false,
        autoComplete: 'password',
        textContentType: 'password',
    },
} as const;

function CampoTesto({
    valore,
    onCambiaTesto,
    placeholder,
    tipo = 'testo',
}: Props) {
    return (
        <TextInput
            value={valore}
            onChangeText={onCambiaTesto}
            placeholder={placeholder}
            accessibilityLabel={placeholder}
            {...PROPS_PER_TIPO[tipo]}
            className="rounded-bottone-sm border border-bordo bg-sfondo px-3 py-2 text-base text-testo-primario placeholder:text-testo-secondario"
        />
    );
}

export default CampoTesto;
