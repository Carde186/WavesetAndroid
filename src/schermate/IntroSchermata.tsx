import { useEffect } from 'react';
import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Logo from '../componenti/Logo';
import type { ParametriStackRadice } from '../navigazione/tipi';

const DURATA_INTRO_MS = 2000;

type Props = NativeStackScreenProps<ParametriStackRadice, 'Intro'>;

function IntroSchermata({ navigation }: Props) {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Tabs');
        }, DURATA_INTRO_MS);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View className="flex-1 items-center justify-center bg-sfondo">
            <Logo dimensione={180} mostraWordmark />
        </View>
    );
}

export default IntroSchermata;
