const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");


const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware");

const router = express.Router();

// USER REGISTRATION
router.post("/register", async (req, res) => {
    try {
        const { name, surname, email, password } = req.body;

        // Validate required fields
        if (!name || !surname || !email || !password) {
            return res.status(400).json({
                error: "All fields are required.",
            });
        }

        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({
                error: "Password must contain at least 8 characters.",
            });
        }

        // Check whether email already exists
        const [existingUsers] = await db.execute(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                error: "An account with this email already exists.",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user (normal user role by default)
        const [result] = await db.execute(
            `INSERT INTO users (name, surname, email, password)
             VALUES (?, ?, ?, ?)`,
            [name.trim(), surname.trim(), email.trim().toLowerCase(), hashedPassword]
        );

        res.status(201).json({
            message: "Account created successfully!",
            user: {
                id: result.insertId,
                name: name.trim(),
                surname: surname.trim(),
                email: email.trim().toLowerCase(),
                role: "user",
            },
        });

    } catch (error) {
        console.error("Registration error:", error.message);

        res.status(500).json({
            error: "Something went wrong during registration.",
        });
    }
});
// USER LOGOUT
router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.json({
        message: "Logged out successfully!",
    });
});

// GET AUTHENTICATED USER
router.get("/me", authenticateToken, async (req, res) => {
    try {
        const [users] = await db.execute(
            `SELECT id, name, surname, email, role, created_at,
                    profile_picture, avatar_type
                FROM users
                WHERE id = ?`,
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                error: "User not found.",
            });
        }

        res.json({
            user: users[0],
        });

    } catch (error) {
        console.error("Profile error:", error.message);

        res.status(500).json({
            error: "Could not retrieve user profile.",
        });
    }
});

// USER LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required.",
            });
        }

        // Find user by email
        const [users] = await db.execute(
            "SELECT * FROM users WHERE email = ?",
            [email.trim().toLowerCase()]
        );

        if (users.length === 0) {
            return res.status(401).json({
                error: "Invalid email or password.",
            });
        }

        const user = users[0];

        // Check whether the account is active
        if (!user.is_active) {
            return res.status(403).json({
                error: "Your account has been deactivated. Please contact an administrator."
            });
        }
        
        // Compare entered password with hashed password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );
        

        if (!passwordMatch) {
            return res.status(401).json({
                error: "Invalid email or password.",
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Store JWT in an HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 60 * 60 * 1000,
        });

        res.json({
            message: "Login successful!",
            user: {
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                role: user.role,
                profile_picture: user.profile_picture,
                avatar_type: user.avatar_type,
            },
        });

    } catch (error) {
        console.error("Login error:", error.message);

        res.status(500).json({
            error: "Something went wrong during login.",
        });
    }
});

// ADMIN-ONLY ROUTE
router.get(
    "/admin",
    authenticateToken,
    authorizeRole("admin"),
    (req, res) => {
        res.json({
            message: "Welcome, Administrator!",
            user: req.user,
        });
    }
);

module.exports = router;