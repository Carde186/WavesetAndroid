import { Linking, Pressable, Text, View } from 'react-native';

type Props = {
    autore: string;
    licenza: string;
    fonteUrl: string;
    modificata: boolean;
};

// "CC BY 4.0" -> https://creativecommons.org/licenses/by/4.0/, "CC BY-SA
// 3.0" -> .../by-sa/3.0/, ecc. — costruita dal testo della licenza invece
// che da una tabella per artista, così vale anche per i prossimi lotti
// senza toccare questo file. null se il formato non combacia (licenza
// diversa da un CC standard): in quel caso il testo resta comunque
// visibile, semplicemente non diventa un link a sé.
function urlLicenzaCC(licenza: string): string | null {
    const corrispondenza = licenza.match(
        /^CC\s+(BY(?:-(?:SA|ND|NC|NC-SA|NC-ND|NC-ND-SA))?)\s+([\d.]+)$/i,
    );
    if (!corrispondenza) {
        return null;
    }
    const tipo = corrispondenza[1].toLowerCase();
    const versione = corrispondenza[2];
    return `https://creativecommons.org/licenses/${tipo}/${versione}/`;
}

// Credito per una foto a licenza libera (Wikimedia Commons, CC BY/CC
// BY-SA — CLAUDE.md, "Catalogo reale"). Autore e indicazione di eventuale
// modifica sono testo sempre visibile, non solo dietro un tap. Licenza e
// fonte sono DUE link indipendenti, non uno solo: la pagina del file su
// Commons (autore, cronologia, conferma della licenza) e il testo della
// licenza CC specifica (creativecommons.org) sono due destinazioni
// diverse, entrambe richieste — non bastava un unico Pressable che
// apriva solo Commons. Reso solo quando il backend manda un credito (mai
// per il seed dimostrativo, i cui placeholder non hanno licenza da citare
// — vedi DettaglioArtistaSchermata).
function CreditoFoto({ autore, licenza, fonteUrl, modificata }: Props) {
    const urlLicenza = urlLicenzaCC(licenza);

    return (
        <View
            className="mx-4 mt-1 flex-row flex-wrap items-baseline"
            accessible={false}
        >
            <Text className="text-xs text-testo-secondario">
                Foto: {autore} ·{' '}
            </Text>

            {urlLicenza ? (
                <Pressable
                    onPress={() => Linking.openURL(urlLicenza)}
                    accessibilityRole="link"
                    accessibilityLabel={`Licenza ${licenza}. Tocca per leggerne il testo su Creative Commons.`}
                    hitSlop={4}
                >
                    <Text className="text-xs text-accento underline">
                        {licenza}
                    </Text>
                </Pressable>
            ) : (
                <Text className="text-xs text-testo-secondario">{licenza}</Text>
            )}

            {modificata && (
                <Text className="text-xs text-testo-secondario">
                    {' '}
                    · ritagliata rispetto all’originale
                </Text>
            )}

            <Text className="text-xs text-testo-secondario"> · </Text>

            <Pressable
                onPress={() => Linking.openURL(fonteUrl)}
                accessibilityRole="link"
                accessibilityLabel="Fonte: pagina del file su Wikimedia Commons. Tocca per aprirla."
                hitSlop={4}
            >
                <Text className="text-xs text-accento underline">fonte</Text>
            </Pressable>
        </View>
    );
}

export default CreditoFoto;
