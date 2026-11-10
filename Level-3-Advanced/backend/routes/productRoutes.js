
const express = require("express");
const db = require("../db");

const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Protect all product routes.
// Only authenticated users can access the inventory.
router.use(authenticateToken);

// ===================================
// GET ALL PRODUCTS
// ===================================

router.get("/", async (req, res) => {
    try {
        const [products] = await db.query(
            "SELECT * FROM products"
        );

        res.status(200).json(products);

    } catch (error) {
        console.error("GET products error:", error.message);

        res.status(500).json({
            message: "Failed to retrieve products."
        });
    }
});

// ===================================
// GET ONE PRODUCT BY ID
// ===================================

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id)) || Number(id) < 1) {
            return res.status(400).json({
                message: "Invalid product ID."
            });
        }

        const [products] = await db.query(
            "SELECT * FROM products WHERE id = ?",
            [id]
        );

        if (products.length === 0) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        res.status(200).json(products[0]);

    } catch (error) {
        console.error("GET product error:", error.message);

        res.status(500).json({
            message: "Failed to retrieve product."
        });
    }
});

// ===================================
// CREATE A NEW PRODUCT
// ===================================

router.post("/", async (req, res) => {
    try {
        const { name, category, price, quantity } = req.body;

        if (
            typeof name !== "string" ||
            name.trim() === "" ||
            typeof category !== "string" ||
            category.trim() === "" ||
            price === undefined ||
            quantity === undefined ||
            !Number.isFinite(Number(price)) ||
            Number(price) < 0 ||
            !Number.isInteger(Number(quantity)) ||
            Number(quantity) < 0
        ) {
            return res.status(400).json({
                message: "Please provide a valid name, category, price and quantity."
            });
        }

        const [result] = await db.query(
            `INSERT INTO products (name, category, price, quantity)
             VALUES (?, ?, ?, ?)`,
            [
                name.trim(),
                category.trim(),
                Number(price),
                Number(quantity)
            ]
        );
         // Notify connected users that inventory has changed.
        const io = req.app.get("io");

        io?.emit("products:changed", {
            action: "created",
            productId: result.insertId
        });

        res.status(201).json({
            message: "Product created successfully!",
            productId: result.insertId
        });

    } catch (error) {
        console.error("POST product error:", error.message);

        res.status(500).json({
            message: "Failed to create product."
        });
    }
});

// ===================================
// UPDATE AN EXISTING PRODUCT
// ===================================

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, price, quantity } = req.body;

        if (!Number.isInteger(Number(id)) || Number(id) < 1) {
            return res.status(400).json({
                message: "Invalid product ID."
            });
        }

        if (
            typeof name !== "string" ||
            name.trim() === "" ||
            typeof category !== "string" ||
            category.trim() === "" ||
            price === undefined ||
            quantity === undefined ||
            !Number.isFinite(Number(price)) ||
            Number(price) < 0 ||
            !Number.isInteger(Number(quantity)) ||
            Number(quantity) < 0
        ) {
            return res.status(400).json({
                message: "Please provide a valid name, category, price and quantity."
            });
        }

        const [result] = await db.query(
            `UPDATE products
             SET name = ?, category = ?, price = ?, quantity = ?
             WHERE id = ?`,
            [
                name.trim(),
                category.trim(),
                Number(price),
                Number(quantity),
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Product not found."
            });
        }
        // Notify connected users that a product was updated.
        const io = req.app.get("io");

        io?.emit("products:changed", {
            action: "updated",
            productId: Number(id)
        });

        res.status(200).json({
            message: "Product updated successfully!"
        });

    } catch (error) {
        console.error("PUT product error:", error.message);

        res.status(500).json({
            message: "Failed to update product."
        });
    }
});

// ===================================
// DELETE A PRODUCT
// ===================================

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id)) || Number(id) < 1) {
            return res.status(400).json({
                message: "Invalid product ID."
            });
        }

        const [result] = await db.query(
            "DELETE FROM products WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Product not found."
            });
        }
        // Notify connected users that a product was deleted.
        const io = req.app.get("io");

        io?.emit("products:changed", {
            action: "deleted",
            productId: Number(id)
        });

        res.status(200).json({
            message: "Product deleted successfully!"
        });

    } catch (error) {
        console.error("DELETE product error:", error.message);

        res.status(500).json({
            message: "Failed to delete product."
        });
    }
});

module.exports = router;
