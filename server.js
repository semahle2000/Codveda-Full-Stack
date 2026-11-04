const express = require("express");
const pool = require("./db");

const app = express();
const PORT = 3000;

// Middleware to read JSON request data
app.use(express.json());

// ===================================
// HOME ROUTE
// ===================================

app.get("/", (req, res) => {
    res.status(200).send(
        "Welcome to the Codveda Product API!"
    );
});

// ===================================
// GET ALL PRODUCTS
// ===================================

app.get("/api/products", async (req, res) => {
    try {
        const [products] = await pool.query(
            "SELECT * FROM products"
        );

        res.status(200).json(products);

    } catch (error) {
        console.error("GET products error:", error.message);

        res.status(500).json({
            message: "Failed to retrieve products"
        });
    }
});

// ===================================
// GET ONE PRODUCT BY ID
// ===================================

app.get("/api/products/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id)) || Number(id) < 1) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const [products] = await pool.query(
            "SELECT * FROM products WHERE id = ?",
            [id]
        );

        if (products.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(products[0]);

    } catch (error) {
        console.error("GET product error:", error.message);

        res.status(500).json({
            message: "Failed to retrieve product"
        });
    }
});

// ===================================
// CREATE A NEW PRODUCT
// ===================================

app.post("/api/products", async (req, res) => {
    try {
        const { name, price, quantity } = req.body;

        if (
            typeof name !== "string" ||
            name.trim() === "" ||
            price === undefined ||
            quantity === undefined ||
            !Number.isFinite(Number(price)) ||
            Number(price) < 0 ||
            !Number.isInteger(Number(quantity)) ||
            Number(quantity) < 0
        ) {
            return res.status(400).json({
                message: "Please provide a valid name, price and quantity."
            });
        }

        const sql = `
            INSERT INTO products (name, price, quantity)
            VALUES (?, ?, ?)
        `;

        const [result] = await pool.query(sql, [
            name.trim(),
            price,
            quantity
        ]);

        res.status(201).json({
            message: "Product created successfully!",
            productId: result.insertId
        });

    } catch (error) {
        console.error("POST product error:", error.message);

        res.status(500).json({
            message: "Failed to create product"
        });
    }
});

// ===================================
// UPDATE AN EXISTING PRODUCT
// ===================================

app.put("/api/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, quantity } = req.body;

        if (!Number.isInteger(Number(id)) || Number(id) < 1) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        if (
            typeof name !== "string" ||
            name.trim() === "" ||
            price === undefined ||
            quantity === undefined ||
            !Number.isFinite(Number(price)) ||
            Number(price) < 0 ||
            !Number.isInteger(Number(quantity)) ||
            Number(quantity) < 0
        ) {
            return res.status(400).json({
                message: "Please provide a valid name, price and quantity."
            });
        }

        const sql = `
            UPDATE products
            SET name = ?, price = ?, quantity = ?
            WHERE id = ?
        `;

        const [result] = await pool.query(sql, [
            name.trim(),
            price,
            quantity,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully!"
        });

    } catch (error) {
        console.error("PUT product error:", error.message);

        res.status(500).json({
            message: "Failed to update product"
        });
    }
});

// ===================================
// DELETE A PRODUCT
// ===================================

app.delete("/api/products/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id)) || Number(id) < 1) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const [result] = await pool.query(
            "DELETE FROM products WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully!"
        });

    } catch (error) {
        console.error("DELETE product error:", error.message);

        res.status(500).json({
            message: "Failed to delete product"
        });
    }
});

// ===================================
// HANDLE UNKNOWN ROUTES
// ===================================

app.use((req, res) => {
    res.status(404).json({
        message: "Endpoint not found"
    });
});

// ===================================
// START THE SERVER
// ===================================

app.listen(PORT, () => {
    console.log(
        `Server is running on http://localhost:${PORT}`
    );
});