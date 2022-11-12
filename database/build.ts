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
    )`
];

const database = SQLite.openDatabase('database');

function buildDatabase() {
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