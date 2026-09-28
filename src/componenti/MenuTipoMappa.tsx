import { Pressable, Text, View } from 'react-native';
import { Check, Layers } from 'lucide-react-native';

import { TIPI_MAPPA } from '../preferenze/ContestoPreferenze';
import type { TipoMappa } from '../preferenze/ContestoPreferenze';
import { useToken } from '../tema/useToken';
import BottoneIcona from './BottoneIcona';

type Props = {
    tipo: TipoMappa;
    aperto: boolean;
    onApriChiudi: () => void;
    onScegli: (tipo: TipoMappa) => void;
};

// Bottone Layers nell'angolo in alto a destra della mappa, con un piccolo
// pannello sotto (non un modale: resta dentro l'area della mappa). Va messo
// come fratello della MapView, dentro lo stesso contenitore.
function MenuTipoMappa({ tipo, aperto, onApriChiudi, onScegli }: Props) {
    const token = useToken();

    return (
        <View className="absolute right-3 top-3 items-end">
            {/* Sfondo e bordo: senza, l'icona si perderebbe sulla mappa. */}
            <View className="rounded-full border border-bordo bg-superficie">
                <BottoneIcona
                    icona={Layers}
                    accessibilityLabel="Tipo di mappa"
                    colore={token.testoPrimario}
                    onPress={onApriChiudi}
                />
            </View>

            {aperto && (
                <View
                    accessibilityRole="menu"
                    className="mt-2 w-40 overflow-hidden rounded-card border border-bordo bg-superficie"
                >
                    {TIPI_MAPPA.map(({ valore, etichetta }) => {
                        const attivo = valore === tipo;

                        return (
                            <Pressable
                                key={valore}
                                accessibilityRole="menuitem"
                                accessibilityState={{ selected: attivo }}
                                onPress={() => onScegli(valore)}
                                className="flex-row items-center justify-between px-3 py-2.5 active:opacity-70"
                            >
                                <Text
                                    className={
                                        attivo
                                            ? 'font-semibold text-accento'
                                            : 'text-testo-primario'
                                    }
                                >
                                    {etichetta}
                                </Text>
                                {attivo && (
                                    <Check size={16} color={token.accento} />
                                )}
                            </Pressable>
                        );
                    })}
                </View>
            )}
        </View>
    );
}

export default MenuTipoMappa;
