const mysql = require('mysql2');

const pool = mysql.createPool({
    port:process.env.DB_PORT,
    host:process.env.DB_HOST, //will be changed at the time of deployment
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.MYSQL_DB,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

module.exports = pool;