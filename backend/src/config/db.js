const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smart_scheduling',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create a connection pool instead of a single connection for better performance
const pool = mysql.createPool(dbConfig);

// Helper function to test connection
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to the MySQL database.');
        connection.release();
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        console.error('Please ensure MySQL is running and the database exists.');
    }
};

testConnection();

module.exports = pool;
