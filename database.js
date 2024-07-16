// database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run(`CREATE TABLE admin (
        username TEXT PRIMARY KEY,
        password TEXT
      )`);
    
    db.run(`CREATE TABLE company (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_name TEXT,
        company_api_key TEXT
      )`);
    
    db.run(`CREATE TABLE location (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_id INTEGER,
        location_name TEXT,
        location_country TEXT,
        location_city TEXT,
        location_meta TEXT,
        FOREIGN KEY(company_id) REFERENCES company(id)
      )`);
    
    db.run(`CREATE TABLE sensor (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        location_id INTEGER,
        sensor_name TEXT,
        sensor_category TEXT,
        sensor_meta TEXT,
        sensor_api_key TEXT,
        FOREIGN KEY(location_id) REFERENCES location(id)
      )`);
    
    db.run(`CREATE TABLE sensor_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sensor_id INTEGER,
        data TEXT,
        timestamp INTEGER,
        FOREIGN KEY(sensor_id) REFERENCES sensor(id)
      )`);
});

module.exports = db;
