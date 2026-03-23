import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './app/App';

// Link vector icons for all icon sets 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Generate icon font maps
MaterialIcons.loadFont();
Ionicons.loadFont();

// Register the app component for rendering
registerRootComponent(App); 