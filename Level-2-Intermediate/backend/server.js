const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const db = require("./db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
    res.send("Level 2 Backend is running!");
});

app.get("/api/test-db", async (req, res) => {
    try {
        const [result] = await db.query("SELECT 1 AS test");
        res.json({
            message: "MySQL connection successful!",
            result: result[0],
        });
    } catch (error) {
        console.error("Database connection error:", error.message);
        res.status(500).json({
            error: "Database connection failed.",
        });
    }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Level 2 Backend running on port ${PORT}`);
});