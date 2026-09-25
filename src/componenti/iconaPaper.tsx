import type { LucideIcon } from 'lucide-react-native';

// I componenti React Native Paper (Button, IconButton, FAB) accettano un
// "icon" come funzione render (size, color) => ReactNode. Questa factory
// evita di definire quella funzione inline nel render di ogni schermata
// (react/no-unstable-nested-components).
export function creaIconaPaper(Icona: LucideIcon) {
    return ({ size, color }: { size: number; color: string }) => (
        <Icona size={size} color={color} />
    );
}
