const pool = require("./db");

async function testConnection() {
    try {
        const [results] = await pool.query("SELECT * FROM products");

        console.log("Successfully connected to MySQL!");
        console.log("Products:", results);

    } catch (error) {
        console.error("Database error:", error.message);

    } finally {
        await pool.end();
    }
}

testConnection();
