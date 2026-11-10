const express = require("express");
const http = require("http");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();

const db = require("./db");

// Import API routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const profileRoutes = require("./routes/profileRoutes");
const productRoutes = require("./routes/productRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const initializeSocket = require("./socket");

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Serve uploaded profile pictures
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Register API routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/products", productRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);

// API root
app.get("/", (req, res) => {
    res.send("Level 3 Backend is running!");
});

// Test database connection
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

// Create an HTTP server.
// Socket.IO is attached to this server.
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Make Socket.IO available to Express routes
app.set("io", io);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Level 3 Backend running on port ${PORT}`);
    console.log("Socket.IO is ready for connections.");
});
