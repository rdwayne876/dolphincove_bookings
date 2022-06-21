const mysql = require('mysql')
require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true,
})

connection.connect((err) =>{
    if(!err)
        console.log('DB connection success');
    else   
        console.log('Connection failed!' + JSON.stringify(err, undefined, 2));
})

module.exports = connection