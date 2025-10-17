const {Pool} = require('pg');
const pool = new Pool({
    host: 'db',
    port: 5432,
    database: 'outer_games',
    user: 'user',
    password: 'password'
})

module.exports = pool