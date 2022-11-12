import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import OrderProductList from './OrderProductList';
import ProductList from './ProductList';
import styled from 'styled-components/native';
import FeatherIcon from '@expo/vector-icons/Feather';
import * as SQLite from 'expo-sqlite';
import React from 'react';
import formatMonetaryValue from './formatMonetaryValue';

const database = SQLite.openDatabase('database');

const FinishOrder = styled.View`
    height: 75px;
    width: 100%;
    background-color: #34a853;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const TotalContainer = styled.View`
    margin-left: 10px;
`;

const TotalLabel = styled.Text`
    font-size: 15px;
    color: white;
    font-weight: bold;
`;

const Total = styled.Text`
    font-size: 30px;
    color: white;
    margin-top: -8px;
`;

const Tab = createMaterialTopTabNavigator();

export default class Home extends React.Component<any, any> {
    state = {
        total: 0
    }
    componentDidMount() {
        this.getTotal()
    }

    componentDidUpdate(_, prevState) {
        if (this.state !== prevState) {  
            this.getTotal()
        }
    }

    getTotal() {
        database.transaction(transaction => {
            transaction.executeSql(`
                SELECT 
                    price,
                    quantity 
                from OrderProducts 
                WHERE orderId = (SELECT id FROM Orders WHERE status = 'open')
            `, [], (_, { rows }) => {
                let total = 0
                rows._array.forEach(({ price, quantity }) => {
                    total = total + (price * quantity)
                });
                this.setState({
                    total 
                })  
            })
        })
    }

    render() {
        return (
            <>
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
                <FinishOrder>
                    <TotalContainer>
                        <TotalLabel>
                            Total
                        </TotalLabel>
                        <Total>
                            {formatMonetaryValue(this.state?.total || 0)}                   
                        </Total>
                    </TotalContainer>
                    <FeatherIcon name='chevron-right' color='white' size={40} />
                </FinishOrder>
            </>
        )
    }
}