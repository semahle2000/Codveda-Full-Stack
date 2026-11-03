require("dotenv").config();

const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((error) => {
    if (error) {
        console.error("Connection failed:", error.message);
        return;
    }

    console.log("Successfully connected to MySQL!");

    connection.query("SELECT VERSION() AS version", (error, results) => {
        if (error) 
        {
            console.error("Query failed:", error.message);
        } 
        else 
        {
            console.log("MySQL Version:", results[0].version);
        }

        connection.end();
    });
});