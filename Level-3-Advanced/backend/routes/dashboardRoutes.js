const express = require("express");
const db = require("../db");

const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// GET DASHBOARD STATISTICS
// Only authenticated users can access dashboard statistics.

router.get("/stats", authenticateToken, async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT
                COUNT(*) AS total_products,
                COUNT(DISTINCT category) AS total_categories,
                COALESCE(SUM(price * quantity), 0) AS inventory_value,
                COALESCE(
                    SUM(CASE WHEN quantity < 5 THEN 1 ELSE 0 END),
                    0
                ) AS low_stock
            FROM products
        `);

        res.status(200).json({
            totalProducts: results[0].total_products,
            totalCategories: results[0].total_categories,
            inventoryValue: Number(results[0].inventory_value),
            lowStock: results[0].low_stock
        });

    } catch (error) {
        console.error("Dashboard statistics error:", error.message);

        res.status(500).json({
            message: "Failed to retrieve dashboard statistics."
        });
    }
});

module.exports = router;