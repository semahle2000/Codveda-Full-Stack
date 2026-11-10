function Sidebar({ activePage, onNavigate, user }) {
    function handleNavigation(event, page) {
        event.preventDefault();
        onNavigate(page);
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <h2>StockFlow</h2>
                <p>Inventory Management</p>
            </div>

            <nav className="sidebar-nav">
                <p className="nav-heading">MAIN MENU</p>

                <a
                    href="#"
                    className={`nav-link ${activePage === "dashboard" ? "active" : ""}`}
                    onClick={(e) => handleNavigation(e, "dashboard")}
                >
                    <span>▦</span> Dashboard
                </a>

                <a
                    href="#"
                    className={`nav-link ${activePage === "products" ? "active" : ""}`}
                    onClick={(e) => handleNavigation(e, "products")}
                >
                    <span>▣</span> Products
                </a>

                <a
                    href="#"
                    className={`nav-link ${activePage === "categories" ? "active" : ""}`}
                    onClick={(e) => handleNavigation(e, "categories")}
                >
                    <span>▤</span> Categories
                </a>

                <a
                    href="#"
                    className={`nav-link ${activePage === "inventory" ? "active" : ""}`}
                    onClick={(e) => handleNavigation(e, "inventory")}
                >
                    <span>◷</span> Inventory
                </a>

                {user?.role === "admin" && (
                    <>
                        <p className="nav-heading">MANAGEMENT</p>

                        <a
                            href="#"
                            className={`nav-link ${activePage === "users" ? "active" : ""}`}
                            onClick={(e) => handleNavigation(e, "users")}
                        >
                            <span>♙</span> Users
                        </a>
                    </>
                )}

                <p className="nav-heading">SETTINGS</p>

                <a
                    href="#"
                    className={`nav-link ${activePage === "settings" ? "active" : ""}`}
                    onClick={(e) => handleNavigation(e, "settings")}
                >
                    <span>⚙</span> Settings
                </a>
            </nav>

            <div className="sidebar-footer">
                <p>StockFlow v1.0</p>
                <small>Product Management System</small>
            </div>
        </aside>
    );
}

export default Sidebar;