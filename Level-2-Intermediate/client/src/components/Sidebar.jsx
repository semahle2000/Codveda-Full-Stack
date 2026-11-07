function Sidebar({ activePage, onNavigate, user }) {
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
                    onClick={(e) => {
                        e.preventDefault();
                        onNavigate("dashboard");
                    }}
                >
                    <span>▦</span>
                    Dashboard
                </a>

                <a href="#" className="nav-link">
                    <span>▣</span>
                    Products
                </a>

                <a href="#" className="nav-link">
                    <span>▤</span>
                    Categories
                </a>

                <a href="#" className="nav-link">
                    <span>◷</span>
                    Inventory
                </a>

                {user?.role === "admin" && (
                    <>
                        <p className="nav-heading">MANAGEMENT</p>

                        <a
                            href="#"
                            className={`nav-link ${activePage === "users" ? "active" : ""}`}
                            onClick={(e) => {
                                e.preventDefault();
                                onNavigate("users");
                            }}
                        >
                            <span>♙</span>
                            Users
                        </a>
                    </>
                )}

                <p className="nav-heading">SETTINGS</p>

                <a href="#" className="nav-link">
                    <span>⚙</span>
                    Settings
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