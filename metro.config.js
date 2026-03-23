/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 */

const { getDefaultConfig } = require('@react-native/metro-config');
const path = require('path');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  
  const { resolver } = config;
  
  // Add additional asset extensions for fonts
  config.resolver = {
    ...resolver,
    assetExts: [...resolver.assetExts, 'ttf', 'otf'],
    sourceExts: [...resolver.sourceExts, 'mjs'],
    extraNodeModules: {
      // Force all font imports to resolve to react-native-vector-icons package
      '@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts': 
        path.resolve(__dirname, 'node_modules/react-native-vector-icons/Fonts'),
      'react-native-vector-icons/Fonts': 
        path.resolve(__dirname, 'node_modules/react-native-vector-icons/Fonts')
    }
  };

  return config;
})(); 