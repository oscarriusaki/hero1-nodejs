const { Pool } = require('pg');  

const pool = new Pool({
    host: process.env.HOST || 'localhost',
    user: process.env.USER || 'postgres',
    password: process.env.PASSWORD || '00000000',
    database: process.env.DATABASE || 'heroeApp',
    port: process.env.PORT_DATABASE || '5432'
})

module.exports = pool;

