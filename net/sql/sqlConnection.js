const config = require('../../constant.json');
const mysql = require('mysql');

function connectSQL() {
    const conn = mysql.createConnection(config.DB);
    conn.connect(err => {
        if (err) throw err;
        console.log(`Successfully connected to database server!`);
    });
    return conn;
}
module.exports = { connectSQL }