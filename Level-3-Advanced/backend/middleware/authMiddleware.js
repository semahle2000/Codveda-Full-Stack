const jwt = require("jsonwebtoken");
const db = require("../db");

async function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            error: "Access denied. Please log in.",
        });
    }

    try {
        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check whether the user still exists and is active
        const [users] = await db.execute(
            "SELECT id, name, surname, email, role, is_active, profile_picture, avatar_type FROM users WHERE id = ?",
            [decoded.id]
        );

        if (users.length === 0) {
            return res.status(401).json({
                error: "User account not found. Please log in again.",
            });
        }

        const user = users[0];

       if (!user.is_active) {
            return res.status(403).json({
                error: "Your account has been deactivated. Please contact an administrator.",
            });
        }

        // Use current database details and role
        req.user = {
            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            role: user.role,
            profile_picture: user.profile_picture,
            avatar_type: user.avatar_type,
        };

        next();

    } catch (error) {
        console.error("Authentication error:", error.message);

        return res.status(403).json({
            error: "Invalid or expired authentication token.",
        });
    }
}

function authorizeRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: "You do not have permission to access this resource.",
            });
        }

        next();
    };
}

module.exports = {
    authenticateToken,
    authorizeRole,
};
