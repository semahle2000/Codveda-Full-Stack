import { useEffect, useState } from "react";
import { apiRequest } from "../api";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        role: "user",
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [notificationUserId, setNotificationUserId] = useState(null);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationStatus, setNotificationStatus] = useState("");
    const [sendingNotification, setSendingNotification] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await apiRequest("/api/admin/users");

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch users.");
                }

                setUsers(data);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleCreateUser = async (e) => {
        e.preventDefault();
    
        try {
            setError("");
    
            const response = await apiRequest("/api/admin/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || "Failed to create user.");
            }
    
            setUsers((prev) => [data.user, ...prev]);
    
            setFormData({
                name: "",
                surname: "",
                email: "",
                password: "",
                role: "user",
            });
    
            setShowForm(false);
    
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEditUser = async (e) => {
        e.preventDefault();
    
        try {
            setError("");
    
            const response = await apiRequest(`/api/admin/users/${editingUserId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    name: formData.name,
                    surname: formData.surname,
                    email: formData.email,
                    role: formData.role,
                }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || "Failed to update user.");
            }
    
            setUsers((prev) =>
                prev.map((user) =>
                    user.id === editingUserId ? data.user : user
                )
            );
    
            setEditingUserId(null);
            setShowForm(false);
    
            setFormData({
                name: "",
                surname: "",
                email: "",
                password: "",
                role: "user",
            });
    
        } catch (error) {
            setError(error.message);
        }
    };
    const handleToggleStatus = async (user) => {
        const newStatus = !user.is_active;
    
        const action = newStatus ? "reactivate" : "deactivate";
    
        const confirmed = window.confirm(
            `Are you sure you want to ${action} ${user.name} ${user.surname}'s account?`
        );
    
        if (!confirmed) {
            return;
        }
    
        try {
            setError("");
    
            const response = await apiRequest(
                `/api/admin/users/${user.id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        is_active: newStatus,
                    }),
                }
            );
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || "Failed to update account status.");
            }
    
            setUsers((prev) =>
                prev.map((currentUser) =>
                    currentUser.id === user.id
                        ? { ...currentUser, is_active: newStatus }
                        : currentUser
                )
            );
    
        } catch (error) {
            setError(error.message);
        }
    };
    const handleSendNotification = async (userId) => {
        if (!notificationMessage.trim()) {
            setNotificationStatus("Please enter a notification message.");
            return;
        }

        try {
            setSendingNotification(true);
            setNotificationStatus("");
            setError("");

            const response = await apiRequest(
                `/api/admin/users/${userId}/notify`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        message: notificationMessage.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to send notification.");
            }

            setNotificationStatus("Notification sent successfully!");
            setNotificationMessage("");
            setNotificationUserId(null);

        } catch (error) {
            setNotificationStatus(error.message);
        } finally {
            setSendingNotification(false);
        }
    };
    const filteredUsers = users.filter((user) => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            `${user.name} ${user.surname}`.toLowerCase().includes(search) ||
            user.email.toLowerCase().includes(search);

        const matchesRole =
            roleFilter === "all" || user.role === roleFilter;

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && Boolean(user.is_active)) ||
            (statusFilter === "inactive" && !user.is_active);

        return matchesSearch && matchesRole && matchesStatus;
    });

    if (loading) {
        return <p>Loading users...</p>;
    }


    return (
        <div>
            <div className="users-header">
                <div>
                    <h2>Manage Users</h2>
                    <p>Registered accounts: {users.length}</p>
                </div>

                <button onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Cancel" : "+ Create User"}
                </button>
            </div>
            {error && (
                <p className="error-message">{error}</p>
            )}
            {notificationStatus && !notificationUserId && (
                <p className="success-message">
                    {notificationStatus}
                </p>
            )}
            <div className="users-toolbar">

                <div className="users-search">
                    <span>⌕</span>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="all">All Roles</option>
                    <option value="admin">Administrators</option>
                    <option value="user">Users</option>
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>

            </div>

            {showForm && (
                <form
                    onSubmit={editingUserId ? handleEditUser : handleCreateUser}
                    className="user-form"
                >

                    <h3>{editingUserId ? "Edit User" : "Create New User"}</h3>

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

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    {!editingUserId && (
                        <input
                            type="password"
                            name="password"
                            placeholder="Password (minimum 8 characters)"
                            value={formData.password}
                            onChange={handleChange}
                            minLength={8}
                            required
                        />
                    )}

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>

                    <button type="submit">
                        {editingUserId ? "Save Changes" : "Create User"}
                    </button>

                </form>
            )}

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>USER</th>
                            <th>EMAIL ADDRESS</th>
                            <th>ROLE</th>
                            <th>ACCOUNT STATUS</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="empty-users">
                                    {users.length === 0
                                            ? "No registered users found."
                                            : "No users match your search or filters."}
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <>
                                <tr key={user.id}>
                                    <td>
                                        <div className="admin-user-info">
                                            <div className="admin-user-avatar">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>

                                            <div>
                                                <strong>
                                                    {user.name} {user.surname}
                                                </strong>
                                                <span>User ID: #{user.id}</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td>{user.email}</td>

                                    <td>
                                        <span className={`role-badge ${user.role}`}>
                                            {user.role === "admin" ? "Administrator" : "User"}
                                        </span>
                                    </td>

                                    <td>
                                        <span className={`status-badge ${user.is_active ? "active" : "inactive"}`}>
                                            <span className="status-dot"></span>
                                            {user.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="user-action-buttons">
                                            <button
                                                className="edit-user-btn"
                                                onClick={() => {
                                                    setEditingUserId(user.id);

                                                    setFormData({
                                                        name: user.name,
                                                        surname: user.surname,
                                                        email: user.email,
                                                        password: "",
                                                        role: user.role,
                                                    });

                                                    setShowForm(true);
                                                    setError("");
                                                }}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className={user.is_active ? "deactivate-user-btn" : "reactivate-user-btn"}
                                                onClick={() => handleToggleStatus(user)}
                                            >
                                                {user.is_active ? "Deactivate" : "Reactivate"}
                                            </button>
                                            {user.is_active && (
                                                <button
                                                    className="edit-user-btn"
                                                    onClick={() => {
                                                        setNotificationUserId(
                                                            notificationUserId === user.id ? null : user.id
                                                        );

                                                        setNotificationMessage("");
                                                        setNotificationStatus("");
                                                    }}
                                                >
                                                    {notificationUserId === user.id ? "Cancel Notify" : "Notify"}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                                {notificationUserId === user.id && (
                                    <tr>
                                        <td colSpan="5">
                                            <div className="user-form">
                                                <h3>
                                                    Send Notification to {user.name} {user.surname}
                                                </h3>

                                                <textarea
                                                    placeholder="Enter your notification message..."
                                                    value={notificationMessage}
                                                    onChange={(e) => setNotificationMessage(e.target.value)}
                                                    maxLength={500}
                                                    rows={3}
                                                    required
                                                />

                                                <p>
                                                    {notificationMessage.length}/500 characters
                                                </p>

                                                <button
                                                    type="button"
                                                    onClick={() => handleSendNotification(user.id)}
                                                    disabled={sendingNotification}
                                                >
                                                    {sendingNotification ? "Sending..." : "Send Notification"}
                                                </button>

                                                {notificationStatus && (
                                                    <p>{notificationStatus}</p>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                    
                                )}
                            </>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminUsers;