import { View } from 'react-native';

import Logo from '../componenti/Logo';

// Passato direttamente come riferimento a `headerLeft` (non richiamato
// inline con una arrow function nel render) per evitare
// react/no-unstable-nested-components, e per riusare lo stesso componente
// su tutte le schermate radice dei tab invece di ridefinirlo ovunque.
function LogoHeaderLeft() {
    return (
        <View className="mr-2">
            <Logo dimensione={40} sfocato={false} />
        </View>
    );
}

export default LogoHeaderLeft;
