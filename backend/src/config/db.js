const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smart_scheduling',
    max: 10,
});

// Helper function to test connection
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Successfully connected to the PostgreSQL database.');
        client.release();
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        console.error('Please ensure PostgreSQL is running and the database exists.');
    }
};

testConnection();

module.exports = pool;
