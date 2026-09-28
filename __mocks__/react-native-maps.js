// Mock di react-native-maps per Jest: la mappa è una view nativa di Google
// Maps, che nei test non esiste. Basta una View con i metodi che l'app chiama
// sul ref. Sta in un file a sé (e non in un jest.mock dentro jest.setup.js)
// perché NativeWind riscrive React.createElement con il proprio runtime, e
// Jest vieta variabili esterne dentro la factory di jest.mock.
const React = require('react');
const { View } = require('react-native');

class MapView extends React.Component {
    fitToCoordinates() {}
    animateToRegion() {}
    render() {
        return React.createElement(View, null, this.props.children);
    }
}

function Marker(props) {
    return React.createElement(View, null, props.children);
}

module.exports = {
    __esModule: true,
    default: MapView,
    Marker,
    PROVIDER_GOOGLE: 'google',
};
