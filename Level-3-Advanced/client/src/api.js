const API_URL = import.meta.env.VITE_API_URL || "";

// Shared API request function.
export async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: "include",
    });

    return response;
}

export default API_URL;