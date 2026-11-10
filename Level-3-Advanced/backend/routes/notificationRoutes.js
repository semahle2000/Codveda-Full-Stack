const express = require("express");
const db = require("../db");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// All notification routes require authentication.
router.use(authenticateToken);

// GET ALL NOTIFICATIONS FOR THE LOGGED-IN USER
router.get("/", async (req, res) => {
    try {
        const [notifications] = await db.query(
            `SELECT
                n.id,
                n.message,
                n.type,
                n.is_read,
                n.created_at,
                u.name AS sender_name,
                u.surname AS sender_surname
             FROM notifications n
             LEFT JOIN users u ON n.sender_id = u.id
             WHERE n.user_id = ?
             ORDER BY n.created_at DESC`,
            [req.user.id]
        );

        res.status(200).json(notifications);

    } catch (error) {
        console.error("Fetch notifications error:", error);

        res.status(500).json({
            message: "Failed to retrieve notifications."
        });
    }
});

// GET UNREAD NOTIFICATION COUNT
router.get("/unread-count", async (req, res) => {
    try {
        const [result] = await db.query(
            `SELECT COUNT(*) AS unreadCount
             FROM notifications
             WHERE user_id = ? AND is_read = 0`,
            [req.user.id]
        );

        res.status(200).json({
            unreadCount: result[0].unreadCount
        });

    } catch (error) {
        console.error("Unread notification count error:", error);

        res.status(500).json({
            message: "Failed to retrieve unread notification count."
        });
    }
});

// MARK A NOTIFICATION AS READ
router.patch("/:id/read", async (req, res) => {
    try {
        const notificationId = Number(req.params.id);

        if (!Number.isInteger(notificationId) || notificationId <= 0) {
            return res.status(400).json({
                message: "Invalid notification ID."
            });
        }

        const [result] = await db.query(
            `UPDATE notifications
             SET is_read = 1
             WHERE id = ? AND user_id = ?`,
            [notificationId, req.user.id]
        );

        if (result.affectedRows === 0) {
            const [existing] = await db.query(
                `SELECT id
                 FROM notifications
                 WHERE id = ? AND user_id = ?`,
                [notificationId, req.user.id]
            );

            if (existing.length === 0) {
                return res.status(404).json({
                    message: "Notification not found."
                });
            }
        }

        res.status(200).json({
            message: "Notification marked as read.",
            notificationId
        });

    } catch (error) {
        console.error("Mark notification as read error:", error);

        res.status(500).json({
            message: "Failed to update notification."
        });
    }
});

module.exports = router;