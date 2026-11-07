
import { useState } from "react";

function Auth({ onLogin }) {
    const [isRegistering, setIsRegistering] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        const endpoint = isRegistering
            ? "/api/auth/register"
            : "/api/auth/login";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(
                    isRegistering
                        ? formData
                        : {
                            email: formData.email,
                            password: formData.password,
                        }
                ),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong.");
            }

            if (isRegistering) {
                setMessage("Account created successfully! You can now log in.");
                setIsRegistering(false);
                setFormData({
                    name: "",
                    surname: "",
                    email: formData.email,
                    password: "",
                });
            } else {
                onLogin(data.user);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>StockFlow</h1>

                <h2>
                    {isRegistering ? "Create an Account" : "Welcome Back"}
                </h2>

                <p>
                    {isRegistering
                        ? "Register to manage your products."
                        : "Log in to your StockFlow dashboard."}
                </p>

                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit}>
                    {isRegistering && (
                        <>
                            <input
                                type="text"
                                name="name"
                                placeholder="First Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="text"
                                name="surname"
                                placeholder="Surname"
                                value={formData.surname}
                                onChange={handleChange}
                                required
                            />
                        </>
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading
                            ? "Please wait..."
                            : isRegistering
                                ? "Register"
                                : "Login"}
                    </button>
                </form>

                <p>
                    {isRegistering
                        ? "Already have an account?"
                        : "Don't have an account?"}

                    {" "}

                    <button
                        type="button"
                        className="auth-toggle"
                        onClick={() => {
                            setIsRegistering(!isRegistering);
                            setMessage("");
                            setError("");
                        }}
                    >
                        {isRegistering ? "Login" : "Register"}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Auth;
