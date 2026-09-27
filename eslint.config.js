const reactNative = require('@react-native/eslint-config/flat');
const globals = require('globals');

module.exports = [
    ...reactNative,
    {
        // eslint-plugin-ft-flow 2.x (richiesto da @react-native/eslint-config
        // 0.87) usa context.getAllComments/getScope, rimossi in ESLint 9: le
        // sue regole fanno crashare il lint di qualunque file .js. Servono
        // solo a riconoscere i tipi Flow, che in questo progetto non ci sono.
        files: ['**/*.js'],
        rules: {
            'ft-flow/define-flow-type': 'off',
            'ft-flow/use-flow-type': 'off',
        },
    },
    {
        // Il backend è Node (CommonJS, Buffer, process), non React Native.
        files: ['backend/**/*.js'],
        languageOptions: { globals: globals.node },
    },
    {
        files: ['jest.setup.js'],
        languageOptions: { globals: globals.jest },
    },
];
