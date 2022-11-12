import React from 'react';
import { FlatList } from 'react-native';
import ProductListRow from './ProductListRow';
import * as SQLite from 'expo-sqlite';
import styled from 'styled-components/native';
import FeatherIcon from '@expo/vector-icons/Feather';

const database = SQLite.openDatabase('database');

const AddProduct = styled.Pressable`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
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
        let orderId: any = 0;

        database.transaction(transaction => {
            transaction.executeSql(`
                SELECT id FROM Orders WHERE Orders.status = 'open'
            `, [], (_, { rows }) => {
                if (!rows._array.length) {
                    transaction.executeSql(`
                        INSERT INTO Orders (status) VALUES ('open')
                    `, [], (_, { insertId }) => {
                        orderId = insertId
                    })
                } else {
                    orderId = rows._array[0].id
                }

                transaction.executeSql(`
                    SELECT
                        orders.id as orderId,
                        Products.id,
                        Products.title,
                        Products.price,
                        OrderProducts.quantity
                    FROM Orders
                    JOIN OrderProducts
                    JOIN Products
                    WHERE 
                        Orders.id = (SELECT id FROM Orders WHERE status = 'open') AND
                        OrderProducts.orderId = Orders.id AND
                        Products.id = OrderProducts.productId;
                `, [], (_, { rows }) => {
                    this.setState({
                        products: rows._array
                    })
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
                {!this.state?.products.length ? (
                    <AddProduct 
                        android_ripple={{ borderless: true }} 
                        onPress={() => this.props.navigation.navigate('ProductList')}
                    >
                        <FeatherIcon name='plus-circle' color='#c8c6c6' size={200} />
                    </AddProduct>
                ) : (
                    <FlatList
                        data={this.state.products}
                        renderItem={({ item }) => (
                            <ProductListRow 
                                productId={item.id}
                                mediaSource={item.mediaSorce}
                                title={item.title}
                                price={item.price}
                                quantity={item.quantity}
                            />
                        )}
                        keyExtractor={(_, index) => String(index + 1)}
                    />
                )} 
            </>
        )
    }
}