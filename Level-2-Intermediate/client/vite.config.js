import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api/auth": {
                target: "http://127.0.0.1:4000",
                changeOrigin: true,
            },
            "/api/admin": {
                target: "http://127.0.0.1:4000",
                changeOrigin: true,
            },
            "/api/profile": {
                target: "http://127.0.0.1:4000",
                changeOrigin: true,
            },
            "/uploads": {
                target: "http://127.0.0.1:4000",
                changeOrigin: true,
            },
            "/api": {
                target: "http://127.0.0.1:3000",
                changeOrigin: true,
            },
        },
    },
});