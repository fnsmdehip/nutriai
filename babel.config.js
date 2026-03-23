module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.json'],
          alias: {
            // This helps with resolving @expo/vector-icons correctly
            '@expo/vector-icons': '@expo/vector-icons/build'
          },
        },
      ],
      'react-native-reanimated/plugin'
    ],
  };
};
