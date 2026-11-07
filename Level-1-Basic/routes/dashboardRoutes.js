const express = require("express");
const db = require("../db");

const router = express.Router();

// GET DASHBOARD STATISTICS
router.get("/stats", async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT
                COUNT(*) AS total_products,
                COALESCE(SUM(price * quantity), 0) AS inventory_value,
                COALESCE(
                    SUM(CASE WHEN quantity < 5 THEN 1 ELSE 0 END),
                    0
                ) AS low_stock
            FROM products
        `);

        res.json({
            totalProducts: results[0].total_products,
            inventoryValue: Number(results[0].inventory_value),
            lowStock: results[0].low_stock
        });

    } catch (error) {
        console.error("Dashboard statistics error:", error.message);

        res.status(500).json({
            error: "Failed to retrieve dashboard statistics."
        });
    }
});

module.exports = router;