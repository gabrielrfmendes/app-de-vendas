import React from 'react';
import { FlatList } from 'react-native';
import ListRow from './ListRow';
import FeatherIcon from '@expo/vector-icons/Feather';
import styled from 'styled-components/native';
import ProductListRow from './ProductListRow';
import * as SQLite from 'expo-sqlite';

const database = SQLite.openDatabase('database');
const ListRowIcon = styled.View`
    background-color: #34a853;
    height: 48px;
    width: 48px;
    border-radius: 24px;
    flex-direction: row; 
    align-items: center;
    justify-content: center;
    margin: 0px 10px;
`;

export default class ProductList extends React.Component<any, any> {
    componentDidMount() {
        this.getProducts()
    }

    componentDidUpdate(_, prevState) {
        if (this.state !== prevState) {
            this.getProducts()
        }
    }

    getProducts() {
        database.transaction(transaction => {
            transaction.executeSql(`
                SELECT 
                    Products.id,
                    title,
                    Products.price,
                    (
                        SELECT 
                            quantity 
                        FROM OrderProducts 
                        WHERE OrderProducts.productId = Products.id 
                        AND OrderProducts.orderId = (SELECT id FROM Orders WHERE status = 'open')
                    ) as quantity
                FROM Products
            `, [], (_, { rows }) => {
                this.setState({
                    products: rows._array
                })
            }, (_, sqlStatementError) => {
                throw Error(sqlStatementError.message)
            })
        }, transactionError => {
           throw Error(transactionError.message)
        })
    }
    
    render() {
        return (
            <>
                {!this.state?.products.length && <ListRow
                    supportingVisual={<ListRowIcon>
                        <FeatherIcon 
                            name='plus' 
                            size={18} 
                            color={'white'} 
                            style={{ top: -5 }} 
                        />
                        <FeatherIcon 
                            name='tag' 
                            size={23} 
                            color={'white'} 
                            style={{ 
                                left: -2, 
                                bottom: -2 
                            }}
                        />
                    </ListRowIcon>}
                    primaryText='Novo produto'
                    onPress={() => this.props.navigation.navigate('ProductCreate')}   
                />}
                <FlatList
                    data={this.state?.products}
                    renderItem={({item, index}) => (
                        <>
                            {index === 0 && <ListRow
                                supportingVisual={<ListRowIcon>
                                    <FeatherIcon 
                                        name='plus' 
                                        size={18} 
                                        color={'white'} 
                                        style={{ top: -5 }} 
                                    />
                                    <FeatherIcon 
                                        name='tag' 
                                        size={23} 
                                        color={'white'} 
                                        style={{ 
                                            left: -2, 
                                            bottom: -2 
                                        }}
                                    />
                                </ListRowIcon>}
                                primaryText='Novo produto'
                                onPress={() => this.props.navigation.navigate('ProductCreate')}   
                            />}
                            <ProductListRow
                                productId={item.id}
                                mediaSource={item.mediaSource}
                                title={item.title}
                                price={item.price}
                                quantity={item.quantity}
                            />
                        </>
                    )}
                    keyExtractor={(_, index) => String(index + 1)}
                />
            </>
        )
    }
}