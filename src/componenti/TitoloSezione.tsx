import type { ReactNode } from 'react';
import { Text } from 'react-native';

type Props = {
    children: ReactNode;
};

function TitoloSezione({ children }: Props) {
    return (
        <Text
            accessibilityRole="header"
            className="mx-4 mt-4 text-xl font-semibold text-testo-primario"
        >
            {children}
        </Text>
    );
}

export default TitoloSezione;
