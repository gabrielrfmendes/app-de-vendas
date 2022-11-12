import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductCreate from './ProductCreate';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import Home from './Home';

const Stack = createNativeStackNavigator();

export default function App() {
    
    return (
        <ActionSheetProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name='Home'
                        component={Home}
                        options={{
                            headerTitle: 'Home',
                            headerTintColor: 'white',
                            headerShadowVisible: false,
                            headerStyle: {
                                backgroundColor: '#34a853'
                            }
                        }}
                    />
                    <Stack.Screen
                        name='ProductCreate'
                        component={ProductCreate}
                        options={{
                            headerTitle: 'Novo produto',
                            headerTintColor: 'white',
                            headerStyle: {
                                backgroundColor: '#34a853'
                            }
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </ActionSheetProvider>
    )
}
