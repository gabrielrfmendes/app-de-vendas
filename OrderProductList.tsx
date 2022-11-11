import React from 'react';
import { FlatList } from 'react-native';
import ProductListRow from './ProductListRow';
import * as SQLite from 'expo-sqlite';

const database = SQLite.openDatabase('database');

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
            <FlatList
                data={this.state?.products}
                renderItem={({ item }) => (
                    <ProductListRow 
                        id={item.id}
                        mediaSource={item.mediaSorce}
                        title={item.title}
                        price={item.price}
                        quantity={item.quantity}
                    />
                )}
                keyExtractor={(_, index) => String(index + 1)}
            />
        )
    }
}