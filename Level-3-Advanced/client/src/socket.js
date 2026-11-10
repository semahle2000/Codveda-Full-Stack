import { io } from "socket.io-client";

// Use the configured backend URL in production.
// Fall back to localhost during local development.
const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:4000";

const socket = io(API_URL, {
    withCredentials: true,
    autoConnect: false,
});

export default socket;
