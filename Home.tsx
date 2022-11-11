import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import OrderProductList from './OrderProductList';
import ProductList from './ProductList';

const Tab = createMaterialTopTabNavigator();

export default function Home() {
    return (
        <Tab.Navigator screenOptions={{
            tabBarLabelStyle: { 
                fontSize: 12,
                fontWeight: 'bold',
                color: 'white'
            },
            tabBarStyle: { 
                backgroundColor: '#34a853' 
            },
            tabBarIndicatorStyle: {
                backgroundColor: 'white'
            }
        }}>
            <Tab.Screen 
                name='OrderProductList'
                component={OrderProductList}
                options={{
                    title: 'Pedido'
                }}
            />
            <Tab.Screen 
                name='ProductList'
                component={ProductList}
                options={{
                    title: 'Produtos'
                }}
            />
        </Tab.Navigator>
    )
}