module.exports = {
    presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
    overrides: [
        {
            // Fast Refresh: @react-native/metro-babel-transformer aggiunge il plugin
            // solo se `options.dev && options.hot`, ma Metro 0.87 non passa più
            // `hot` alle opzioni di trasformazione, quindi il plugin non veniva mai
            // applicato. Senza le firme degli hook ($RefreshSig$) React non sa che
            // un componente ha cambiato hook e prova a riusarne lo stato invece di
            // rimontarlo ("Rendered more/fewer hooks"). Stesse condizioni del
            // transformer: solo in sviluppo (envName 'development' <=> dev) e solo
            // per il nostro codice, mai per node_modules né per la build di release.
            exclude: /node_modules/,
            env: {
                development: {
                    plugins: ['react-refresh/babel'],
                },
            },
        },
    ],
};
