import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import Svg, {
    Defs,
    FeGaussianBlur,
    Filter,
    Path,
    RadialGradient,
    Stop,
} from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

type Props = {
    dimensione?: number;
    sfocato?: boolean;
    mostraWordmark?: boolean;
};

// Palette gradiente del blob — CLAUDE.md, sezione "Logo — blob + wordmark".
// Famiglia viola/magenta, non i colori multi-tonalità del riferimento
// originale.
const COLORE_VIVIDO = '#ad04fb';
const COLORE_INTERMEDIO = '#6a34ea';
const COLORE_PROFONDO = '#8c008f';
const COLORE_BASE = '#4408e7';

// Stessi 6 angoli per ogni forma-chiave (stessa topologia): solo il raggio
// di ciascun punto cambia da una chiave all'altra, così l'interpolazione è
// un semplice lerp punto-per-punto, senza bisogno di far corrispondere
// contorni con numero di punti diverso. Angoli NON equidistanti (spaziatura
// 92°,35°,65°,45°,85°,38°) — di proposito, non i 60° regolari di un
// esagono: un'alternanza di raggio corto-lungo su angoli regolari produce
// una forma con simmetria riconoscibile (un sottoinsieme di punti a ~120°
// l'uno dall'altro legge come un triangolo). Da sola questa irregolarità
// non basterebbe (con 6 punti è facile che un sottoinsieme casuale finisca
// comunque vicino a una spaziatura regolare) — va combinata con raggi
// indipendenti per punto, vedi sotto.
const ANGOLI_GRADI = [8, 100, 135, 200, 245, 330];

// Tre forme-chiave con raggio indipendente per ciascun punto — nessun
// pattern che si ripete (niente corto-lungo-corto-lungo): è la
// combinazione con gli angoli irregolari sopra a rompere la simmetria e
// impedire che la forma risolva in un poligono riconoscibile (triangolo,
// esagono...). Restano curve (Catmull-Rom): la variazione è nel raggio dei
// punti di controllo, non in segmenti dritti. Raggio massimo tenuto a ~42
// per lasciare margine all'alone della sfocatura prima del bordo del
// viewBox 0-100.
const FORME_CHIAVE = [
    [40, 22, 35, 18, 30, 25],
    [20, 38, 16, 42, 24, 33],
    [33, 15, 41, 28, 19, 37],
];

// CLAUDE.md, "Logo — blob + wordmark": un ciclo completo dura almeno 8
// secondi prima di ricominciare.
const DURATA_CICLO_MORPH_MS = 9000;

// Converte un set di raggi (stessa lunghezza di ANGOLI_GRADI) in una
// stringa di Path SVG chiusa e morbida, via curve di Bezier cubiche
// (conversione Catmull-Rom). Marcata 'worklet' per poter girare sul thread
// UI dentro useAnimatedProps, invocata ad ogni frame.
function generaContorno(raggi: number[]): string {
    'worklet';
    const centro = { x: 50, y: 50 };
    const punti = ANGOLI_GRADI.map((angoloGradi, i) => {
        const rad = (angoloGradi * Math.PI) / 180;
        return {
            x: centro.x + raggi[i] * Math.cos(rad),
            y: centro.y + raggi[i] * Math.sin(rad),
        };
    });

    const n = punti.length;
    const p = (i: number) => punti[((i % n) + n) % n];

    let d = `M ${punti[0].x.toFixed(2)} ${punti[0].y.toFixed(2)} `;
    for (let i = 0; i < n; i++) {
        const p0 = p(i - 1);
        const p1 = p(i);
        const p2 = p(i + 1);
        const p3 = p(i + 2);
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        d += `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(
            2,
        )} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} `;
    }
    return d + 'Z';
}

// Dato un progresso continuo (non limitato a [0, forme.length)), trova il
// segmento corrente e interpola i raggi punto per punto con una Catmull-Rom
// ciclica sulle forme-chiave (indici modulo k: dopo l'ultima si torna alla
// prima). Una lerp lineare tra chiavi qui non basta: la posizione sarebbe
// continua, ma la velocità cambierebbe di colpo a ogni chiave — compresa A
// a fine ciclo — e quella piega si legge come uno scatto. Con la
// Catmull-Rom la curva passa comunque esattamente per le chiavi (t=0 → A,
// t=1 → B) ma con velocità continua, anche al riavvolgimento.
function raggiInterpolati(progresso: number): number[] {
    'worklet';
    const k = FORME_CHIAVE.length;
    const p = ((progresso % k) + k) % k;
    const indice = Math.floor(p);
    const t = p - indice;
    const p0 = FORME_CHIAVE[(indice - 1 + k) % k];
    const p1 = FORME_CHIAVE[indice];
    const p2 = FORME_CHIAVE[(indice + 1) % k];
    const p3 = FORME_CHIAVE[(indice + 2) % k];
    return p1.map(
        (_, i) =>
            0.5 *
            (2 * p1[i] +
                (-p0[i] + p2[i]) * t +
                (2 * p0[i] - 5 * p1[i] + 4 * p2[i] - p3[i]) * t * t +
                (-p0[i] + 3 * p1[i] - 3 * p2[i] + p3[i]) * t * t * t),
    );
}

const CONTORNO_STATICO = generaContorno(FORME_CHIAVE[0]);

// Un solo shared value guida sia la scala che l'opacità del pulse: sono la
// stessa "respirazione" (crescono e si schiariscono insieme), non due
// animazioni indipendenti che potrebbero sfasarsi nel tempo. Il morphing
// del contorno è un secondo shared value indipendente, sempre attivo, su
// entrambe le versioni (header e intro) — stesso comportamento di
// animazione ovunque, cambia solo `dimensione`.
//
// La scala del pulse è applicata sull'Animated.View che avvolge l'Svg, non
// su un transform dentro l'SVG stesso: gli elementi SVG scalano rispetto
// all'origine delle coordinate (angolo in alto a sinistra), quindi il blob
// "scapperebbe" verso il basso a destra invece di pulsare dal centro. Le
// View di React Native invece scalano dal centro del proprio bounding box
// di default — molto più semplice che gestire transform-origin sull'SVG.
function Logo({
    dimensione = 40,
    sfocato = true,
    mostraWordmark = false,
}: Props) {
    const pulse = useSharedValue(0);
    const morph = useSharedValue(0);

    useEffect(() => {
        pulse.value = withRepeat(
            withTiming(1, {
                duration: 2200,
                easing: Easing.inOut(Easing.sin),
            }),
            -1,
            true,
        );

        // Un ciclo completo A→B→C→A dura DURATA_CICLO_MORPH_MS. Il target è
        // FORME_CHIAVE.length e non FORME_CHIAVE.length - 1: l'ultimo
        // segmento (C→A) fa già parte del ciclo, così a fine corsa il
        // progresso vale k e raggiungiamo A per interpolazione, non con un
        // salto. Con reverse=false withRepeat riparte ogni volta dal valore
        // iniziale originale (0), che mappa sulla stessa FORME_CHIAVE[0].
        morph.value = withRepeat(
            withTiming(FORME_CHIAVE.length, {
                duration: DURATA_CICLO_MORPH_MS,
                easing: Easing.linear,
            }),
            -1,
            false,
        );
    }, [pulse, morph]);

    const stilePulsazione = useAnimatedStyle(() => ({
        transform: [{ scale: 1 + pulse.value * 0.15 }],
        opacity: 0.75 + pulse.value * 0.25,
    }));

    const propsContornoAnimato = useAnimatedProps(() => ({
        d: generaContorno(raggiInterpolati(morph.value)),
    }));

    return (
        <View style={{ width: dimensione, height: dimensione }}>
            <Animated.View style={[StyleSheet.absoluteFill, stilePulsazione]}>
                <Svg
                    width={dimensione}
                    height={dimensione}
                    viewBox="0 0 100 100"
                >
                    <Defs>
                        <RadialGradient
                            id="gradienteBlob"
                            cx="50%"
                            cy="50%"
                            r="50%"
                        >
                            <Stop
                                offset="0%"
                                stopColor={COLORE_VIVIDO}
                                stopOpacity={1}
                            />
                            <Stop
                                offset="40%"
                                stopColor={COLORE_INTERMEDIO}
                                stopOpacity={1}
                            />
                            <Stop
                                offset="75%"
                                stopColor={COLORE_PROFONDO}
                                stopOpacity={0.9}
                            />
                            <Stop
                                offset="100%"
                                stopColor={COLORE_BASE}
                                stopOpacity={0}
                            />
                        </RadialGradient>
                        {sfocato && (
                            <Filter
                                id="sfocaturaBlob"
                                x="-60%"
                                y="-60%"
                                width="220%"
                                height="220%"
                            >
                                <FeGaussianBlur stdDeviation={6} />
                            </Filter>
                        )}
                    </Defs>
                    <AnimatedPath
                        d={CONTORNO_STATICO}
                        animatedProps={propsContornoAnimato}
                        fill="url(#gradienteBlob)"
                        filter={sfocato ? 'url(#sfocaturaBlob)' : undefined}
                    />
                </Svg>
            </Animated.View>

            {/* Wordmark sovrapposto: stesso centro X/Y del blob, layer
                separato sopra la forma — non un elemento impilato prima o
                dopo nel layout verticale. */}
            {mostraWordmark && (
                <View
                    style={StyleSheet.absoluteFill}
                    className="items-center justify-center"
                >
                    <Text
                        className="font-semibold text-testo-primario"
                        style={{ fontSize: dimensione * 0.16 }}
                    >
                        Waveset
                    </Text>
                </View>
            )}
        </View>
    );
}

export default Logo;
