// Import sqlite3
import sqlite3 from 'sqlite3';

// Initialize SQLite database
let db = new sqlite3.Database('./pdfs.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the pdfs database.');
});

// Function to create table if not exists
function createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS pdfs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      metadata TEXT,
      vector TEXT
    );`;

    db.run(sql, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Successful creation of the "pdfs" table');
    });
}

// Function to insert data into table
function insertData(url, metadata, vector) {
    const sql = `
    INSERT INTO pdfs (url, metadata, vector) 
    VALUES (?, ?, ?)`;

    const data = [url, metadata, vector];

    db.run(sql, data, function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
}

// Function to close the database
function closeDatabase() {
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}

export { createTable, insertData, closeDatabase };
