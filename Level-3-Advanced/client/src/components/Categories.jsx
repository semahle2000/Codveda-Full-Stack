import { useEffect, useState } from "react";
import { apiRequest } from "../api";

function Categories({ productsRefresh }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadProducts() {
            try {
                const response = await apiRequest("/api/products");

                if (!response.ok) {
                    throw new Error("Failed to load product categories.");
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

    const groupedCategories = products.reduce((groups, product) => {
        const category = product.category || "Uncategorized";

        if (!groups[category]) {
            groups[category] = {
                products: [],
                totalUnits: 0,
                totalValue: 0,
            };
        }

        groups[category].products.push(product);
        groups[category].totalUnits += Number(product.quantity);
        groups[category].totalValue +=
            Number(product.price) * Number(product.quantity);

        return groups;
    }, {});

    const categories = Object.entries(groupedCategories).sort(
        ([a], [b]) => a.localeCompare(b)
    );

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-ZA", {
            style: "currency",
            currency: "ZAR",
        }).format(amount);

    if (loading) {
        return <p>Loading categories...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <section className="categories-page">
            <div className="page-heading">
                <h2>Product Categories</h2>
                <p>Browse and monitor your inventory by category.</p>
            </div>

            {categories.length === 0 ? (
                <div className="empty-inventory">
                    <h3>No categories available</h3>
                    <p>
                        Add products to your inventory to see their
                        categories here.
                    </p>
                </div>
            ) : (
                <div className="categories-grid">
                    {categories.map(([category, details]) => (
                        <article className="category-card" key={category}>
                            <div className="category-card-header">
                                <h3>{category}</h3>
                                <span>
                                    {details.products.length} products
                                </span>
                            </div>

                            <div className="category-card-stats">
                                <div>
                                    <small>Total Units</small>
                                    <strong>{details.totalUnits}</strong>
                                </div>

                                <div>
                                    <small>Stock Value</small>
                                    <strong>
                                        {formatCurrency(details.totalValue)}
                                    </strong>
                                </div>
                            </div>

                            <div className="category-product-list">
                                <h4>Products</h4>

                                {details.products.map((product) => (
                                    <div
                                        className="category-product"
                                        key={product.id}
                                    >
                                        <span>{product.name}</span>
                                        <span>{product.quantity} units</span>
                                    </div>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default Categories;