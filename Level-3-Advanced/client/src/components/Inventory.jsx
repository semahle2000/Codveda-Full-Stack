import { useEffect, useState } from "react";
import { apiRequest } from "../api";

function Inventory({ productsRefresh }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadProducts() {
            try {
                const response = await apiRequest("/api/products");

                if (!response.ok) {
                    throw new Error("Failed to load inventory.");
                }

                const data = await response.json();

                if (!cancelled) {
                    setProducts(
                        Array.isArray(data) ? data : data.products || []
                    );
                    setError("");
                }
            } catch (error) {
                if (!cancelled) {
                    setError(error.message);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadProducts();

        return () => {
            cancelled = true;
        };
    }, [productsRefresh]);

    const totalUnits = products.reduce(
        (total, product) => total + Number(product.quantity),
        0
    );

    const lowStockProducts = products.filter(
        (product) =>
            Number(product.quantity) > 0 &&
            Number(product.quantity) <= 5
    );

    const outOfStockProducts = products.filter(
        (product) => Number(product.quantity) === 0
    );

    function getStockStatus(quantity) {
        if (quantity === 0) {
            return "Out of Stock";
        }

        if (quantity <= 5) {
            return "Low Stock";
        }

        return "In Stock";
    }

    function getStockClass(quantity) {
        if (quantity === 0) {
            return "out-of-stock";
        }

        if (quantity <= 5) {
            return "low-stock";
        }

        return "in-stock";
    }

    if (loading) {
        return <p>Loading inventory...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <section className="inventory-page">
            <div className="page-heading">
                <h2>Inventory Overview</h2>
                <p>Monitor stock levels and identify products that need restocking.</p>
            </div>

            <div className="inventory-summary-grid">
                <article className="inventory-summary-card">
                    <span>Total Products</span>
                    <strong>{products.length}</strong>
                </article>

                <article className="inventory-summary-card">
                    <span>Total Units</span>
                    <strong>{totalUnits}</strong>
                </article>

                <article className="inventory-summary-card">
                    <span>Low Stock</span>
                    <strong>{lowStockProducts.length}</strong>
                </article>

                <article className="inventory-summary-card">
                    <span>Out of Stock</span>
                    <strong>{outOfStockProducts.length}</strong>
                </article>
            </div>

            <div className="inventory-alerts">
                <div className="inventory-alert low-stock-alert">
                    <h3>Low Stock Alerts</h3>
                    {lowStockProducts.length === 0 ? (
                        <p>No products currently need restocking.</p>
                    ) : (
                        <ul>
                            {lowStockProducts.map((product) => (
                                <li key={product.id}>
                                    {product.name} — {product.quantity} units remaining
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="inventory-alert out-stock-alert">
                    <h3>Out-of-Stock Alerts</h3>
                    {outOfStockProducts.length === 0 ? (
                        <p>No products are currently out of stock.</p>
                    ) : (
                        <ul>
                            {outOfStockProducts.map((product) => (
                                <li key={product.id}>
                                    {product.name} — Restocking required
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="product-section">
                <div className="product-section-header">
                    <div>
                        <h2>Stock Levels</h2>
                        <p>Current stock status for all products.</p>
                    </div>
                </div>

                <div className="table-container">
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Quantity</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="empty-inventory">
                                        No products available in your inventory.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => {
                                    const quantity = Number(product.quantity);

                                    return (
                                        <tr key={product.id}>
                                            <td>{product.name}</td>
                                            <td>{product.category}</td>
                                            <td>{quantity}</td>
                                            <td>
                                                <span className={`status ${getStockClass(quantity)}`}>
                                                    {getStockStatus(quantity)}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export default Inventory;