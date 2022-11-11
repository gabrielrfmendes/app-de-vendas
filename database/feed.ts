import * as SQLite from 'expo-sqlite';

const data = [
    `INSERT INTO Products (
        title, 
        price
    ) VALUES (
        'Café',
        1.99
    )`,
    `INSERT INTO Products (
        title, 
        price
    ) VALUES (
        'Milk',
        0.50
    )`,
    `INSERT INTO Products (
        mediaSource,
        title, 
        price
    ) VALUES (
        'https://github.com/gabrielrfmendes.png',
        'Sandwich',
        2.50
    )`,
    `INSERT INTO Orders (
        status
    ) VALUES (
        'open'
    )`,
    `INSERT INTO OrderProducts (
        orderId,
        productId,
        price,
        quantity
    ) VALUES (
        1,
        2,
        0.50,
        1
    )`,
    `INSERT INTO OrderProducts (
        orderId,
        productId,
        price,
        quantity
    ) VALUES (
        1,
        1,
        1.99,
        1
    )`
];

const database = SQLite.openDatabase('database');

function feedDatabase() {
    database.exec([{ sql: 'PRAGMA foreign_keys = ON', args: [] }], false, () => {
        console.log('Foreign keys turned on')
    });
    
    database.transaction(transaction => {
        data.forEach(sqlStatement => {
            transaction.executeSql(sqlStatement, [], () => {}, (_, sqlStatementError) => {
                throw Error(sqlStatementError.message)
            })
        })
    }, transactionError => {
        throw Error(transactionError.message)
    }, () => {
        console.log('Database structured')
    });
}

export default feedDatabase