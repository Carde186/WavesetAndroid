/**
 * Le due parti della ricerca che a mano non si possono provare in modo
 * affidabile: il debounce e le risposte che arrivano fuori ordine. Timer
 * finti e risposte controllate dal test.
 */

import ReactTestRenderer from 'react-test-renderer';

import { cercaNelCatalogo } from '../src/api/catalogo';
import type { RisultatiRicerca } from '../src/api/tipi';
import { useRicerca } from '../src/hooks/useRicerca';

jest.mock('../src/api/catalogo', () => ({ cercaNelCatalogo: jest.fn() }));

const cercaFinta = cercaNelCatalogo as jest.MockedFunction<
    typeof cercaNelCatalogo
>;

// Un hook gira solo dentro un componente: questa sonda lo esegue e salva
// l'ultimo valore restituito.
let ultimo: ReturnType<typeof useRicerca>;
function Sonda({ testo }: { testo: string }) {
    ultimo = useRicerca(testo);
    return null;
}

function risultatiCon(nomeArtista: string): RisultatiRicerca {
    return {
        artisti: [{ id: 1, nome: nomeArtista, immagine_url: null }],
        brani: [],
    };
}

// Promessa che il test risolve quando vuole, per simulare la rete.
function rispostaControllata() {
    let risolvi: (valore: RisultatiRicerca) => void = () => {};
    const promessa = new Promise<RisultatiRicerca>(r => {
        risolvi = r;
    });
    return { promessa, risolvi };
}

async function monta() {
    let sonda!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
        sonda = ReactTestRenderer.create(<Sonda testo="" />);
    });
    return sonda;
}

// Equivale a un tasto premuto nel campo di ricerca.
async function scrivi(
    sonda: ReactTestRenderer.ReactTestRenderer,
    testo: string,
) {
    await ReactTestRenderer.act(() => {
        sonda.update(<Sonda testo={testo} />);
    });
}

async function avanza(ms: number) {
    await ReactTestRenderer.act(async () => {
        jest.advanceTimersByTime(ms);
    });
}

beforeEach(() => {
    jest.useFakeTimers();
    cercaFinta.mockReset();
});

afterEach(() => {
    jest.useRealTimers();
});

test('debounce: digitando in fretta parte una sola ricerca, per il testo finale', async () => {
    cercaFinta.mockResolvedValue(risultatiCon('Nova Circuit'));
    const sonda = await monta();

    await scrivi(sonda, 'no');
    await avanza(100);
    await scrivi(sonda, 'nov');
    await avanza(100);
    await scrivi(sonda, 'nova');
    await avanza(299);
    expect(cercaFinta).not.toHaveBeenCalled();

    await avanza(1);
    expect(cercaFinta).toHaveBeenCalledTimes(1);
    expect(cercaFinta).toHaveBeenCalledWith('nova');
    expect(ultimo.risultati?.artisti[0].nome).toBe('Nova Circuit');
});

test('risposte fuori ordine: resta il risultato dell’ultima ricerca', async () => {
    const lenta = rispostaControllata();
    const veloce = rispostaControllata();
    cercaFinta
        .mockReturnValueOnce(lenta.promessa)
        .mockReturnValueOnce(veloce.promessa);
    const sonda = await monta();

    await scrivi(sonda, 'no');
    await avanza(300); // parte la ricerca "no" (lenta)
    await scrivi(sonda, 'nova');
    await avanza(300); // parte la ricerca "nova" (veloce)

    await ReactTestRenderer.act(async () => {
        veloce.risolvi(risultatiCon('Risultato di nova'));
    });
    await ReactTestRenderer.act(async () => {
        lenta.risolvi(risultatiCon('Risultato di no'));
    });

    expect(ultimo.risultati?.artisti[0].nome).toBe('Risultato di nova');
    expect(ultimo.testoCercato).toBe('nova');
    expect(ultimo.inCaricamento).toBe(false);
});

test('sotto i 2 caratteri non chiama il backend', async () => {
    const sonda = await monta();

    await scrivi(sonda, 'n');
    await avanza(1000);

    expect(cercaFinta).not.toHaveBeenCalled();
    expect(ultimo.troppoCorto).toBe(true);
    expect(ultimo.risultati).toBeNull();
});
