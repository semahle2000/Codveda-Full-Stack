import { useEffect, useMemo, useState } from "react";

function ProductTable({onProductsChange,searchTerm,categoryFilter,stockFilter,onCategoriesChange}) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        quantity: "",
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            const response = await fetch("/api/products");

            if (!response.ok) {
                throw new Error("Failed to fetch products.");
            }

            const data = await response.json();

            setProducts(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    function handleInputChange(event) {
        const { name, value } = event.target;
    
        setFormData({
            ...formData,
            [name]: value,
        });
    }
    function handleEditClick(product) {
        setEditingProductId(product.id);
    
        setFormData({
            name: product.name,
            category: product.category || "",
            price: product.price,
            quantity: product.quantity,
        });
    
        setShowForm(true);
    }

    async function handleUpdateProduct(event) {
        event.preventDefault();
    
        try {
            const response = await fetch(`/api/products/${editingProductId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    category: formData.category,
                    price: Number(formData.price),
                    quantity: Number(formData.quantity),
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update product.");
            }
    
            await fetchProducts();
            onProductsChange();
    
            setFormData({
                name: "",
                category: "",
                price: "",
                quantity: "",
            });
    
            setEditingProductId(null);
            setShowForm(false);
    
            alert("Product updated successfully!");
    
        } catch (error) {
            alert(error.message);
        }
    }

    async function handleDeleteProduct(productId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );
    
        if (!confirmed) {
            return;
        }
    
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: "DELETE",
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete product.");
            }
    
            await fetchProducts();
            onProductsChange();
    
            alert("Product deleted successfully!");
    
        } catch (error) {
            alert(error.message);
        }
    }

    
    async function handleAddProduct(event) {
        event.preventDefault();
    
        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    category: formData.category,
                    price: Number(formData.price),
                    quantity: Number(formData.quantity),
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || errorData.error || "Failed to add product.");
            }
    
            await fetchProducts();
            onProductsChange();
    
            setFormData({
                name: "",
                category: "",
                price: "",
                quantity: "",
            });
    
            setShowForm(false);
    
            alert("Product added successfully!");
    
        } catch (error) {
            alert(error.message);
        }
    }
    const filteredProducts = products.filter((product) => {
        const search = searchTerm.toLowerCase();
    
        const matchesSearch =
            product.name.toLowerCase().includes(search) ||
            (product.category || "").toLowerCase().includes(search);
    
        const matchesCategory =
            categoryFilter === "all" ||
            product.category === categoryFilter;
    
        const quantity = Number(product.quantity);
    
        const matchesStock =
            stockFilter === "all" ||
            (stockFilter === "out" && quantity === 0) ||
            (stockFilter === "low" && quantity > 0 && quantity <= 5) ||
            (stockFilter === "in" && quantity > 5);
    
        return matchesSearch && matchesCategory && matchesStock;
    });
    
    const categories = useMemo(() => {
        return [...new Set(
            products.map((product) => product.category).filter(Boolean)
        )].sort((a, b) => a.localeCompare(b));
    }, [products]);
    
    useEffect(() => {
        onCategoriesChange(categories);
    }, [categories, onCategoriesChange]);

    if (loading) {
        return <p>Loading products...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <section className="product-section">

            <div className="product-section-header">
                <div>
                    <h2>Product Inventory</h2>
                    <p>Manage and monitor your products.</p>
                </div>

                <button
                    className="add-product-button"
                    type="button"
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingProductId(null);
                        setFormData({
                            name: "",
                            category: "",
                            price: "",
                            quantity: "",
                        });
                    }}
                >
                    + Add Product
                </button>
            </div>

            {showForm && (
    <form
    className="product-form"
    onSubmit={editingProductId ? handleUpdateProduct : handleAddProduct}
>

        <h3>{editingProductId ? "Edit Product" : "Add New Product"}</h3>

        <div className="form-group">
            <label>Product Name</label>
            <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleInputChange}
                required
            />
        </div>

        <div className="form-group">
            <label>Category</label>
            <input
                type="text"
                name="category"
                placeholder="e.g. Electronics, Accessories"
                value={formData.category}
                onChange={handleInputChange}
                required
            />
        </div>

        <div className="form-group">
            <label>Price (R)</label>
            <input
                type="number"
                name="price"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleInputChange}
                min="0.01"
                step="0.01"
                required
            />
        </div>

        <div className="form-group">
            <label>Quantity</label>
            <input
                type="number"
                name="quantity"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0"
                step="1"
                required
            />
        </div>

        <div className="form-actions">
            <button type="submit" className="add-product-button">
                {editingProductId ? "Update Product" : "Save Product"}
            </button>

            <button
                type="button"
                className="delete-button"
                onClick={() => {
                    setShowForm(false);
                    setEditingProductId(null);
                    setFormData({
                        name: "",
                        category: "",
                        price: "",
                        quantity: "",
                    });
                }}
            >
                Cancel
            </button>
        </div>

    </form>
)}


            <div className="table-container">
                <table className="product-table">

                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="empty-inventory">
                                        <div>
                                            <h3>No products found</h3>
                                            <p>
                                                {products.length === 0
                                                    ? "Your inventory is currently empty. Add a product to get started."
                                                    : "No products match your search or filters."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td>{product.category}</td>

                                        <td>
                                            R{Number(product.price).toLocaleString("en-ZA")}
                                        </td>

                                        <td>{product.quantity}</td>

                                        <td>
                                            <span className={
                                                Number(product.quantity) === 0
                                                    ? "status out-of-stock"
                                                    : Number(product.quantity) <= 5
                                                        ? "status low-stock"
                                                        : "status in-stock"
                                            }>
                                                {Number(product.quantity) === 0
                                                    ? "Out of Stock"
                                                    : Number(product.quantity) <= 5
                                                        ? "Low Stock"
                                                        : "In Stock"}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                className="edit-button"
                                                type="button"
                                                onClick={() => handleEditClick(product)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-button"
                                                type="button"
                                                onClick={() => handleDeleteProduct(product.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                    </tbody>

                </table>
            </div>

        </section>
    );
}

export default ProductTable;