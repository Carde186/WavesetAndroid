module.exports = {
    preset: '@react-native/jest-preset',
    setupFiles: ['<rootDir>/jest.setup.js'],
    // Resolver ufficiale di Reanimated 4: in Jest usa le implementazioni JS di
    // alcuni moduli interni al posto di quelle che richiedono il codice nativo.
    resolver: 'react-native-reanimated/jest/resolver',
    // backend/ ha i propri test (runner integrato di Node, `npm test` in
    // backend/): senza questa esclusione Jest li raccoglierebbe ed eseguirebbe
    // contro il backend acceso.
    testPathIgnorePatterns: ['/node_modules/', '<rootDir>/backend/'],
    // Pacchetti pubblicati come ES module (React Navigation, Lucide, NativeWind
    // e le librerie react-native-*): Jest di default non trasforma node_modules.
    // Il prefisso "react-native" copre anche react-native-svg, -reanimated, ecc.
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|lucide-react-native|nativewind|react-native-css-interop)/?)',
    ],
    moduleNameMapper: {
        '\\.css$': '<rootDir>/__mocks__/stileMock.js',
        // La condizione "react-native" degli exports punta alla build ESM (.mjs),
        // che il transform del preset non copre: nei test si usa quella CommonJS.
        '^lucide-react-native$':
            '<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js',
    },
};
