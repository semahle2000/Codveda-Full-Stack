const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { parseCookie } = require("cookie");
const db = require("./db");

function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            credentials: true,
        },
    });

    // Authenticate every incoming Socket.IO connection.
    io.use(async (socket, next) => {
        try {
            // Read cookies from the Socket.IO handshake.
            const cookieHeader = socket.handshake.headers.cookie;

            if (!cookieHeader) {
                return next(new Error("Authentication required."));
            }

            const cookies = parseCookie(cookieHeader);
            const token = cookies.token;

            if (!token) {
                return next(new Error("Authentication required."));
            }

            // Verify the JWT.
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            // Retrieve the current user from MySQL.
            const [users] = await db.execute(
                `SELECT id, name, surname, email, role, is_active
                 FROM users
                 WHERE id = ?`,
                [decoded.id]
            );

            if (users.length === 0) {
                return next(new Error("User account not found."));
            }

            const user = users[0];

            if (!user.is_active) {
                return next(new Error("Your account has been deactivated."));
            }

            // Store verified user information on the socket.
            socket.user = {
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                role: user.role,
            };

            next();

        } catch (error) {
            console.error("Socket authentication error:", error.message);
            next(new Error("Invalid or expired authentication token."));
        }
    });

    // Handle authenticated connections.
    io.on("connection", (socket) => {
        const user = socket.user;

        // Each user joins their own private room.
        socket.join(`user:${user.id}`);

        // Administrators also join the administrator room.
        if (user.role === "admin") {
            socket.join("role:admin");
        }

        console.log(
            `Socket connected: ${user.name} ${user.surname} (ID: ${user.id})`
        );

        socket.on("disconnect", (reason) => {
            console.log(
                `Socket disconnected: ${user.name} (ID: ${user.id}) - ${reason}`
            );
        });
    });

    return io;
}

module.exports = initializeSocket;
