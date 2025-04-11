import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import App from './App';
import { store } from './store';
import { name as appName } from './app.json';

const Root = () => (
  <Provider store={store}>
    <NavigationContainer>
      <App />
    </NavigationContainer>
  </Provider>
);

AppRegistry.registerComponent(appName, () => Root); 