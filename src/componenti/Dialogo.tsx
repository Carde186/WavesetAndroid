import type { ReactNode } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Pressable,
    Text,
    View,
} from 'react-native';

type Props = {
    visibile: boolean;
    titolo: string;
    onChiudi: () => void;
    children: ReactNode;
};

// Finestra modale centrata su fondo scurito. Usa il Modal di React Native, così
// il tasto Indietro di Android (onRequestClose) e il tocco fuori dal
// riquadro chiudono la finestra. Le azioni (Annulla/Conferma) le mette il
// chiamante dentro `children`.
function Dialogo({ visibile, titolo, onChiudi, children }: Props) {
    return (
        <Modal
            visible={visibile}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onChiudi}
        >
            <KeyboardAvoidingView
                behavior="padding"
                className="flex-1 justify-center bg-black/60 px-6"
            >
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Chiudi finestra"
                    onPress={onChiudi}
                    className="absolute inset-0"
                />
                <View className="rounded-card border border-bordo bg-superficie p-4">
                    <Text
                        accessibilityRole="header"
                        className="mb-3 text-xl font-semibold text-testo-primario"
                    >
                        {titolo}
                    </Text>
                    {children}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

export default Dialogo;
