import { useState, useEffect } from "react";
import socket from "./socket";
import { apiRequest } from "./api";

import Auth from "./components/Auth";
import Welcome from "./components/Welcome";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import ProductTable from "./components/ProductTable";
import AdminUsers from "./components/AdminUsers";
import Categories from "./components/Categories";
import Inventory from "./components/Inventory";
import Settings from "./components/Settings";

import "./App.css";

function App() {
    const [user, setUser] = useState(null);
    const [socketConnected, setSocketConnected] = useState(false);
    const [socketNotification, setSocketNotification] = useState(null);
    const [showNotificationToast, setShowNotificationToast] = useState(false);

    // Automatically dismiss incoming notification messages.
    useEffect(() => {
        if (!showNotificationToast) return;

        const timer = setTimeout(() => {
            setShowNotificationToast(false);
        }, 6000);

        return () => clearTimeout(timer);
    }, [showNotificationToast]);

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
    const [productsRefresh, setProductsRefresh] = useState(0);

    // Check whether a user is already logged in
    useEffect(() => {
        async function checkSession() {
            try {
                const response = await apiRequest("/api/auth/me", {
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
    // Manage Socket.IO connection based on authentication
    useEffect(() => {
        if (!user) return;

        function handleConnect() {
            setSocketConnected(true);
            console.log("Connected to StockFlow real-time server.");
        }

        function handleDisconnect() {
            setSocketConnected(false);
            console.log("Disconnected from StockFlow real-time server.");
        }

        function handleNotification(notification) {
            setSocketNotification(notification);
            setShowNotificationToast(true);
            console.log("New notification:", notification);
        }

        function handleProductsChanged(data) {
            console.log("Inventory changed:", data);
        
            // Refresh dashboard statistics.
            setStatsRefresh(prev => prev + 1);
        
            // Refresh the product table.
            setProductsRefresh(prev => prev + 1);
        }

        function handleConnectError(error) {
            setSocketConnected(false);
            console.error("Socket connection error:", error.message);
        }

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("notification", handleNotification);
        socket.on("products:changed", handleProductsChanged);
        socket.on("connect_error", handleConnectError);

        socket.connect();

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("notification", handleNotification);
            socket.off("products:changed", handleProductsChanged);
            socket.off("connect_error", handleConnectError);

            socket.disconnect();
            setSocketConnected(false);
        };
    }, [user]);

    // Fetch dashboard statistics after login
    useEffect(() => {
        if (!user) return;

        async function fetchStats() {
            try {
                setLoadingStats(true);
                setStatsError("");

                const response = await apiRequest("/api/dashboard/stats");

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
            await apiRequest("/api/auth/logout", {
                method: "POST",
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

    // Page titles and descriptions
    const pageDetails = {
        dashboard: {
            title: "StockFlow Overview",
            subtitle: "",
        },
        products: {
            title: "Products",
            subtitle: "Manage, search and organise your products.",
        },
        categories: {
            title: "Categories",
            subtitle: "Browse your inventory by product category.",
        },
        inventory: {
            title: "Inventory",
            subtitle: "Monitor stock levels and identify products that need restocking.",
        },
        users: {
            title: "User Management",
            subtitle: "Manage StockFlow accounts and access permissions.",
        },
        settings: {
            title: "Settings",
            subtitle: "Manage your account information and preferences.",
        },
    };

    const currentPage = pageDetails[activePage] || pageDetails.dashboard;

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
                <div className="connection-status">
                    <span
                        className={`connection-indicator ${
                            socketConnected ? "connected" : "disconnected"
                        }`}
                    ></span>
                    <span>
                        Real-time connection:{" "}
                        {socketConnected ? "Connected" : "Disconnected"}
                    </span>
                </div>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {showNotificationToast && socketNotification && (
                <div className="notification-toast">
                    <div className="notification-toast-icon">
                        🔔
                    </div>
                    <div className="notification-toast-content">
                        <strong>New Admin Notification</strong>
                        <p>{socketNotification.message}</p>
                    </div>
                    <button
                        className="notification-toast-close"
                        onClick={() => setShowNotificationToast(false)}
                        aria-label="Close notification"
                    >
                        ×
                    </button>
                </div>
            )}

                
                {activePage === "users" && user.role === "admin" ? (
                    <AdminUsers />
                ) : (
                    <>
                        <Header
                            user={user}
                            socket={socket}
                            onUserUpdate={setUser}
                            onLogout={handleLogout}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            categoryFilter={categoryFilter}
                            setCategoryFilter={setCategoryFilter}
                            stockFilter={stockFilter}
                            setStockFilter={setStockFilter}
                            categories={categories}
                            title={currentPage.title}
                            subtitle={currentPage.subtitle}
                            showProductFilters={activePage === "products"}
                        />

                        {activePage === "dashboard" && (
                            <>
                                <Welcome user={user} />

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
                            </>
                        )}

                        {activePage === "dashboard" && (
                            <ProductTable
                                onProductsChange={() =>
                                    setStatsRefresh(prev => prev + 1)
                                }
                                productsRefresh={productsRefresh}
                                searchTerm={searchTerm}
                                categoryFilter={categoryFilter}
                                stockFilter={stockFilter}
                                onCategoriesChange={setCategories}
                            />
                        )}

                        {activePage === "products" && (
                            <ProductTable
                                onProductsChange={() =>
                                    setStatsRefresh(prev => prev + 1)
                                }
                                productsRefresh={productsRefresh}
                                searchTerm={searchTerm}
                                categoryFilter={categoryFilter}
                                stockFilter={stockFilter}
                                onCategoriesChange={setCategories}
                            />
                        )}

                        {activePage === "categories" && (
                            <Categories productsRefresh={productsRefresh} />
                        )}

                        {activePage === "inventory" && (
                            <Inventory productsRefresh={productsRefresh} />
                        )}

                        {activePage === "settings" && (
                            <Settings user={user} />
                        )}
                    </>
                )}


            </main>

        </div>
    );
}

export default App;