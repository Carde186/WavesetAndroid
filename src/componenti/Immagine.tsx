import { useState } from 'react';
import { Image, View } from 'react-native';
import { Music } from 'lucide-react-native';

import { useToken } from '../tema/useToken';

type Props = {
    uri?: string | null;
    className?: string;
};

// Senza uno User-Agent non vuoto, il CDN di Wikimedia (upload.wikimedia.org,
// usato dalle foto reali del catalogo — CLAUDE.md, "Catalogo reale") risponde
// 403: verificato via diagnostica sul dispositivo (errore Fresco/OkHttp,
// "Unexpected HTTP code ... code=403") e confermato da terminale (stessa
// richiesta con User-Agent vuoto -> 403, con uno qualunque non vuoto -> 200,
// riprodotto anche seguendo l'intera catena di redirect di Special:FilePath/
// Special:Redirect: fallisce comunque con User-Agent vuoto, quindi cambiare
// solo la forma dell'URL non risolve — Fresco, a differenza di un browser o
// di curl, non imposta di default uno User-Agent sulle richieste immagine.
//
// Applicata SOLO alle richieste verso domini Wikimedia (vedi
// richiedeUserAgentWikimedia sotto): gli altri host (picsum.photos del seed
// dimostrativo) restano su source={{ uri }} tale e quale a prima, nessuna
// intestazione in più mandata dove non serve.
//
// Formato richiesto dalla User-Agent policy Wikimedia
// (foundation.wikimedia.org/wiki/Policy:User-Agent_policy): "<client
// name>/<version> (<contact information>)" — l'informazione di contatto è
// l'URL del repository pubblico del progetto (git remote "origin" di questo
// stesso repo), non un recapito inventato.
const USER_AGENT_WAVESET =
    'WavesetAndroid/1.0 (https://github.com/Carde186/WavesetAndroid)';

const DOMINI_WIKIMEDIA_CHE_RICHIEDONO_USER_AGENT = [
    'https://upload.wikimedia.org/',
    'https://commons.wikimedia.org/',
    'https://thumb.wikimedia.org/',
];

function intestazioniPer(
    uri: string,
): { [chiave: string]: string } | undefined {
    const eWikimedia = DOMINI_WIKIMEDIA_CHE_RICHIEDONO_USER_AGENT.some(
        prefisso => uri.startsWith(prefisso),
    );
    return eWikimedia ? { 'User-Agent': USER_AGENT_WAVESET } : undefined;
}

function Immagine({ uri, className }: Props) {
    // NativeWind non raggiunge le icone Lucide (non sono componenti nativi
    // registrati da react-native-css-interop): il colore va passato come
    // prop `color`, letto dal tema corrente invece che fisso, perché lo
    // sfondo bg-superficie dietro cambia con il tema.
    const token = useToken();
    // Un caricamento fallito (rete, 403/404...) deve mostrare lo stesso
    // placeholder di "nessuna immagine", non restare vuoto: prima non
    // c'era alcun gestore d'errore e un fallimento spariva senza traccia
    // in UI. Si tiene l'URI che ha fallito, non solo un booleano: se `uri`
    // cambia (un nuovo indirizzo valido passato allo stesso componente),
    // il confronto sotto smette da solo di considerarlo un errore, senza
    // bisogno di un useEffect per "dimenticare" il fallimento precedente.
    const [uriConErrore, setUriConErrore] = useState<string | null>(null);
    const erroreCaricamento =
        uri !== null && uri !== undefined && uri === uriConErrore;

    if (!uri || erroreCaricamento) {
        return (
            <View
                className={`items-center justify-center bg-superficie ${
                    className ?? ''
                }`}
            >
                <Music size={20} color={token.testoSecondario} />
            </View>
        );
    }

    return (
        <Image
            source={{ uri, headers: intestazioniPer(uri) }}
            className={className}
            onError={() => setUriConErrore(uri)}
        />
    );
}

export default Immagine;
