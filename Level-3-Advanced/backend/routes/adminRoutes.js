const express = require("express");
const db = require("../db");

const {
    authenticateToken,
    authorizeRole
} = require("../middleware/authMiddleware");

const router = express.Router();

// Protect all admin routes
router.use(authenticateToken);
router.use(authorizeRole("admin"));

// GET ALL USERS (ADMIN ONLY)
router.get("/users", async (req, res) => {
    try {
        const [users] = await db.query(
            `SELECT id, name, surname, email, role, is_active, created_at
             FROM users
             ORDER BY id DESC`
        );

        res.status(200).json(users);

    } catch (error) {
        console.error("Fetch users error:", error);

        res.status(500).json({
            message: "Failed to retrieve users."
        });
    }
});

// CREATE NEW USER (ADMIN ONLY)
router.post("/users", async (req, res) => {
    try {
        const { name, surname, email, password, role } = req.body;

        if (
            !name?.trim() ||
            !surname?.trim() ||
            !email?.trim() ||
            !password ||
            password.length < 8 ||
            !["user", "admin"].includes(role)
        ) {
            return res.status(400).json({
                message: "Please provide valid user details. Password must be at least 8 characters."
            });
        }

        const [existingUsers] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email.trim()]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                message: "An account with this email already exists."
            });
        }

        const bcrypt = require("bcryptjs");
        const hashedPassword = await bcrypt.hash(password, 12);

        const [result] = await db.query(
            `INSERT INTO users (name, surname, email, password, role)
             VALUES (?, ?, ?, ?, ?)`,
            [
                name.trim(),
                surname.trim(),
                email.trim().toLowerCase(),
                hashedPassword,
                role
            ]
        );

        res.status(201).json({
            message: "User created successfully.",
            user: {
                id: result.insertId,
                name: name.trim(),
                surname: surname.trim(),
                email: email.trim().toLowerCase(),
                role,
                is_active: 1
            }
        });

    } catch (error) {
        console.error("Create user error:", error);

        res.status(500).json({
            message: "Failed to create user."
        });
    }
});


// UPDATE USER (ADMIN ONLY)
router.put("/users/:id", async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const { name, surname, email, role } = req.body;

        if (
            !Number.isInteger(userId) ||
            userId <= 0 ||
            typeof name !== "string" ||
            !name.trim() ||
            typeof surname !== "string" ||
            !surname.trim() ||
            typeof email !== "string" ||
            !email.trim() ||
            !["user", "admin"].includes(role)
        ) {
            return res.status(400).json({
                message: "Please provide valid user details."
            });
        }

        // Check whether the user exists
        const [existingUser] = await db.query(
            "SELECT id FROM users WHERE id = ?",
            [userId]
        );

        if (existingUser.length === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        // Check whether another account uses this email
        const normalizedEmail = email.trim().toLowerCase();

        const [duplicateEmail] = await db.query(
            "SELECT id FROM users WHERE email = ? AND id != ?",
            [normalizedEmail, userId]
        );

        if (duplicateEmail.length > 0) {
            return res.status(409).json({
                message: "This email address is already in use."
            });
        }

        // Update user details
        await db.query(
            `UPDATE users
             SET name = ?, surname = ?, email = ?, role = ?
             WHERE id = ?`,
            [
                name.trim(),
                surname.trim(),
                normalizedEmail,
                role,
                userId
            ]
        );

        // Retrieve updated user
        const [updatedUsers] = await db.query(
            `SELECT id, name, surname, email, role, is_active, created_at
             FROM users
             WHERE id = ?`,
            [userId]
        );

        res.status(200).json({
            message: "User updated successfully.",
            user: updatedUsers[0]
        });

    } catch (error) {
        console.error("Update user error:", error);

        res.status(500).json({
            message: "Failed to update user."
        });
    }
});

// UPDATE USER ACCOUNT STATUS (ADMIN ONLY)
router.patch("/users/:id/status", async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const { is_active } = req.body;

        if (
            !Number.isInteger(userId) ||
            userId <= 0 ||
            typeof is_active !== "boolean"
        ) {
            return res.status(400).json({
                message: "Please provide a valid user ID and account status."
            });
        }

        // Prevent administrators from deactivating their own accounts
        if (userId === Number(req.user.id) && !is_active) {
            return res.status(403).json({
                message: "You cannot deactivate your own account."
            });
        }

        const [result] = await db.query(
            "UPDATE users SET is_active = ? WHERE id = ?",
            [is_active, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        res.status(200).json({
            message: is_active
                ? "User account reactivated successfully."
                : "User account deactivated successfully.",
            userId,
            is_active
        });

    } catch (error) {
        console.error("Update account status error:", error);

        res.status(500).json({
            message: "Failed to update account status."
        });
    }
});


// SEND PERSISTENT REAL-TIME NOTIFICATION TO A SPECIFIC USER (ADMIN ONLY)
router.post("/users/:id/notify", async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const { message } = req.body;

        // Validate the user ID and notification message.
        if (
            !Number.isInteger(userId) ||
            userId <= 0 ||
            typeof message !== "string" ||
            !message.trim() ||
            message.trim().length > 500
        ) {
            return res.status(400).json({
                message: "Please provide a valid user ID and a message between 1 and 500 characters."
            });
        }

        // Check whether the target user exists and is active.
        const [users] = await db.query(
            "SELECT id, is_active FROM users WHERE id = ?",
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        if (!users[0].is_active) {
            return res.status(409).json({
                message: "Cannot notify an inactive user."
            });
        }

        // Get the Socket.IO instance.
        const io = req.app.get("io");

        if (!io) {
            return res.status(503).json({
                message: "Real-time notification service is unavailable."
            });
        }

        // Save the notification in MySQL first.
        const [result] = await db.query(
            `INSERT INTO notifications
                (user_id, sender_id, message, type)
             VALUES (?, ?, ?, ?)`,
            [
                userId,
                req.user.id,
                message.trim(),
                "info"
            ]
        );

        // Prepare the notification payload.
        const notification = {
            id: result.insertId,
            userId,
            senderId: req.user.id,
            type: "info",
            message: message.trim(),
            isRead: false,
            createdAt: new Date().toISOString()
        };

        // Deliver the notification to the recipient in real time.
        io.to(`user:${userId}`).emit("notification", notification);

        res.status(201).json({
            message: "Notification sent and saved successfully.",
            notification
        });

    } catch (error) {
        console.error("Send notification error:", error);

        res.status(500).json({
            message: "Failed to send notification."
        });
    }
});

module.exports = router;