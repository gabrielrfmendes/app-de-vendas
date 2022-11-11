import * as SQLite from 'expo-sqlite';

const databaseStructure = [
    `DROP TABLE IF EXISTS Products`,
    `CREATE TABLE IF NOT EXISTS Products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mediaSource TEXT,
        title TEXT NOT NULL,
        price DECIMAL NOT NULL
    )`,
    `DROP TABLE IF EXISTS Orders`,
    `CREATE TABLE IF NOT EXISTS Orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        status TEXT CHECK(status IN ('open', 'finished')) 
    )`,
    `DROP TABLE IF EXISTS OrderProducts`,
    `CREATE TABLE IF NOT EXISTS OrderProducts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        productId INTEGER NOT NULL,
        orderId INTEGER NOT NULL,
        price DECIMAL NOT NULL,
        quantity INTEGER NOT NULL,
        CONSTRAINT OrderProduct_productId_fkey FOREIGN KEY (productId) REFERENCES Products (id) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT OrderProduct_orderId_fkey FOREIGN KEY (orderId) REFERENCES Orders (id) ON DELETE RESTRICT ON UPDATE CASCADE
    )`,
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

function 
buildDatabase() {
    database.exec([{ sql: 'PRAGMA foreign_keys = ON', args: [] }], false, () => {
        console.log('Foreign keys turned on')
    });
    
    database.transaction(transaction => {
        databaseStructure.forEach(sqlStatement => {
            transaction.executeSql(sqlStatement, [], () => {}, (_, sqlStatementError) => {
                throw Error(sqlStatementError.message)
            })
        })
    }, transactionError => {
        throw Error(transactionError.message)
    }, () => {
        console.log('Database structured')
    })
}

export default buildDatabase