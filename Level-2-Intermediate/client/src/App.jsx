import { useState, useEffect } from "react";

import Auth from "./components/Auth";
import Welcome from "./components/Welcome";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import ProductTable from "./components/ProductTable";
import AdminUsers from "./components/AdminUsers";

import "./App.css";

function App() {
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [activePage, setActivePage] = useState("dashboard");
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [stockFilter, setStockFilter] = useState("all");
    const [categories, setCategories] = useState([]);

    // Dashboard statistics
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCategories: 0,
        inventoryValue: 0,
        lowStock: 0,
    });

    const [loadingStats, setLoadingStats] = useState(true);
    const [statsError, setStatsError] = useState("");
    const [statsRefresh, setStatsRefresh] = useState(0);

    // Check whether a user is already logged in
    useEffect(() => {
        async function checkSession() {
            try {
                const response = await fetch("/api/auth/me", {
                    credentials: "include",
                });

                if (!response.ok) {
                    setUser(null);
                    return;
                }

                const data = await response.json();
                setUser(data.user);

            } catch (error) {
                console.error("Session check failed:", error);
                setUser(null);

            } finally {
                setCheckingAuth(false);
            }
        }

        checkSession();
    }, []);

    // Fetch dashboard statistics after login
    useEffect(() => {
        if (!user) return;

        async function fetchStats() {
            try {
                setLoadingStats(true);
                setStatsError("");

                const response = await fetch("/api/dashboard/stats");

                if (!response.ok) {
                    throw new Error("Failed to load dashboard statistics.");
                }

                const data = await response.json();
                setStats(data);

            } catch (error) {
                console.error("Statistics error:", error);
                setStatsError(error.message);

            } finally {
                setLoadingStats(false);
            }
        }

        fetchStats();
    }, [user, statsRefresh]);

    // Handle successful login
    function handleLogin(loggedInUser) {
        setUser(loggedInUser);
        setActivePage("dashboard");
    }

    // Handle logout
    async function handleLogout() {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            setUser(null);
            setActivePage("dashboard");

        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    // Show loading screen while checking authentication
    if (checkingAuth) {
        return <h2>Checking your session...</h2>;
    }

    // Show authentication screen if user is not logged in
    if (!user) {
        return <Auth onLogin={handleLogin} />;
    }

    // Format inventory value as South African Rand
    const formattedInventoryValue = new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR",
    }).format(stats.inventoryValue);

    // Show dashboard after successful authentication
    return (
        <div className="app-container">

            <Sidebar
                activePage={activePage}
                onNavigate={setActivePage}
                user={user}
            />

            <main className="main-content">

                <div className="auth-session-bar">
                    <span>
                        Welcome, {user.name} {user.surname} ({user.role})
                    </span>

                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>

                {activePage === "users" && user.role === "admin" ? (
                    <AdminUsers />
                ) : (
                    <>
                        <Header
                            user={user}
                            onUserUpdate={setUser}
                            onLogout={handleLogout}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            categoryFilter={categoryFilter}
                            setCategoryFilter={setCategoryFilter}
                            stockFilter={stockFilter}
                            setStockFilter={setStockFilter}
                            categories={categories}
                        />

                        <Welcome />

                        {statsError && (
                            <p className="error-message">
                                {statsError}
                            </p>
                        )}

                        <section className="stats-grid">

                            <StatCard
                                title="Total Products"
                                value={loadingStats ? "Loading..." : stats.totalProducts}
                                description="Products in your inventory"
                                icon="📦"
                                color="#2563eb"
                            />

                            <StatCard
                                title="Inventory Value"
                                value={loadingStats ? "Loading..." : formattedInventoryValue}
                                description="Total estimated stock value"
                                icon="💰"
                                color="#16a34a"
                            />

                            <StatCard
                                title="Low Stock"
                                value={loadingStats ? "Loading..." : stats.lowStock}
                                description="Products need restocking"
                                icon="⚠️"
                                color="#d97706"
                            />

                            <StatCard
                                title="Categories"
                                value={loadingStats ? "Loading..." : stats.totalCategories}
                                description="Different product categories"
                                icon="📂"
                                color="#7c3aed"
                            />

                        </section>

                        <ProductTable
                            onProductsChange={() =>
                                setStatsRefresh(prev => prev + 1)
                            }
                            searchTerm={searchTerm}
                            categoryFilter={categoryFilter}
                            stockFilter={stockFilter}
                            onCategoriesChange={setCategories}
                        />
                    </>
                )}

            </main>

        </div>
    );
}

export default App;