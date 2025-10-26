const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    password: 'Dita8220#',
    host: 'localhost',
    port: 5432,
    database: 'todo_app'
});

module.exports = pool;