const express = require("express");
const fs = require("fs");
const path = require("path");

const db = require("../db");
const { authenticateToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// UPLOAD OR CHANGE PROFILE PICTURE
router.post(
    "/picture",
    authenticateToken,
    (req, res, next) => {
        upload.single("profile_picture")(req, res, (error) => {
            if (error) {
                return res.status(400).json({
                    message: error.message,
                });
            }

            next();
        });
    },
    async (req, res) => {
        let newPicture = null;

        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "Please select an image.",
                });
            }

            newPicture = req.file.filename;

            const [users] = await db.execute(
                "SELECT profile_picture FROM users WHERE id = ?",
                [req.user.id]
            );

            if (users.length === 0) {
                throw new Error("User not found.");
            }

            const oldPicture = users[0].profile_picture;

            await db.execute(
                "UPDATE users SET profile_picture = ? WHERE id = ?",
                [newPicture, req.user.id]
            );

            if (oldPicture) {
                const oldPath = path.join(
                    __dirname,
                    "../uploads",
                    path.basename(oldPicture)
                );

                fs.unlink(oldPath, (error) => {
                    if (error && error.code !== "ENOENT") {
                        console.error("Old picture deletion error:", error);
                    }
                });
            }

            return res.status(200).json({
                message: "Profile picture uploaded successfully.",
                profile_picture: newPicture,
            });

        } catch (error) {
            if (newPicture) {
                fs.unlink(
                    path.join(__dirname, "../uploads", newPicture),
                    () => {}
                );
            }

            console.error("Profile picture upload error:", error);

            return res.status(500).json({
                message: "Failed to upload profile picture.",
            });
        }
    }
);

// REMOVE PROFILE PICTURE
router.delete("/picture", authenticateToken, async (req, res) => {
    try {
        const [users] = await db.execute(
            "SELECT profile_picture FROM users WHERE id = ?",
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        const oldPicture = users[0].profile_picture;

        await db.execute(
            "UPDATE users SET profile_picture = NULL WHERE id = ?",
            [req.user.id]
        );

        if (oldPicture) {
            const oldPath = path.join(
                __dirname,
                "../uploads",
                path.basename(oldPicture)
            );

            fs.unlink(oldPath, (error) => {
                if (error && error.code !== "ENOENT") {
                    console.error("Picture deletion error:", error);
                }
            });
        }

        return res.status(200).json({
            message: "Profile picture removed successfully.",
        });

    } catch (error) {
        console.error("Remove picture error:", error);

        return res.status(500).json({
            message: "Failed to remove profile picture.",
        });
    }
});

// CHANGE DEFAULT AVATAR
router.put("/avatar", authenticateToken, async (req, res) => {
    try {
        const { avatar_type } = req.body;

        const allowedAvatars = ["male", "female", "generic"];

        if (!allowedAvatars.includes(avatar_type)) {
            return res.status(400).json({
                message: "Invalid avatar selection.",
            });
        }

        const [users] = await db.execute(
            "SELECT profile_picture FROM users WHERE id = ?",
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        const oldPicture = users[0].profile_picture;

        await db.execute(
            "UPDATE users SET avatar_type = ?, profile_picture = NULL WHERE id = ?",
            [avatar_type, req.user.id]
        );

        if (oldPicture) {
            const oldPath = path.join(
                __dirname,
                "../uploads",
                path.basename(oldPicture)
            );

            fs.unlink(oldPath, (error) => {
                if (error && error.code !== "ENOENT") {
                    console.error("Picture deletion error:", error);
                }
            });
        }

        return res.status(200).json({
            message: "Default avatar updated successfully.",
            avatar_type,
        });

    } catch (error) {
        console.error("Avatar update error:", error);

        return res.status(500).json({
            message: "Failed to update avatar.",
        });
    }
});

module.exports = router;