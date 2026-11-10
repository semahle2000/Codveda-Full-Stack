import { useState, useRef, useEffect } from "react";
import { apiRequest } from "../api";

function Header({
    user,
    socket,
    onUserUpdate,
    onLogout,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    stockFilter,
    setStockFilter,
    categories,
    title = "StockFlow Overview",
    subtitle = "",
    showProductFilters = false,
}) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showAvatarOptions, setShowAvatarOptions] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [notificationError, setNotificationError] = useState("");

    const menuRef = useRef(null);
    const fileInputRef = useRef(null);

    const displayName = user
        ? `${user.name} ${user.surname}`
        : "User";

    const role = user?.role === "admin"
        ? "Administrator"
        : "User";

    // Handle clicks outside the profile and notification menus.
    useEffect(() => {
        function handleClickOutside(event) {
            // Close the profile menu when clicking outside it.
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setShowProfileMenu(false);
                setShowAvatarOptions(false);
            }

            // Close the notification dropdown when clicking outside it.
            const notificationContainer = document.querySelector(
                ".notification-container"
            );

            if (
                notificationContainer &&
                !notificationContainer.contains(event.target)
            ) {
                setShowNotifications(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Fetch saved notifications when the Header mounts.
    useEffect(() => {
        let cancelled = false;

        async function loadInitialNotifications() {
            try {
                const response = await apiRequest("/api/notifications");

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to load notifications."
                    );
                }

                if (!cancelled) {
                    setNotifications(data);

                    // Calculate the unread notification count.
                    setUnreadCount(
                        data.filter(notification => !notification.is_read).length
                    );

                    setNotificationError("");
                }
            } catch (error) {
                if (!cancelled) {
                    setNotificationError(error.message);
                }
            }
        }

        loadInitialNotifications();

        return () => {
            cancelled = true;
        };
    }, []);

    // Fetch notifications when the notification dropdown is opened.
    async function fetchNotifications() {
        try {
            setLoadingNotifications(true);
            setNotificationError("");

            const response = await apiRequest("/api/notifications");

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load notifications."
                );
            }

            setNotifications(data);

            // Calculate the unread notification count.
            setUnreadCount(
                data.filter(notification => !notification.is_read).length
            );
        } catch (error) {
            setNotificationError(error.message);
        } finally {
            setLoadingNotifications(false);
        }
    }

    // PLAY A SOUND WHEN A NEW NOTIFICATION ARRIVES.
    async function playNotificationSound() {
        try {
            const AudioContextClass =
                window.AudioContext || window.webkitAudioContext;

            if (!AudioContextClass) return;

            const audioContext = new AudioContextClass();

            if (audioContext.state === "suspended") {
                await audioContext.resume();
            }

            const now = audioContext.currentTime;

            function playTone(frequency, startTime, duration) {
                const oscillator = audioContext.createOscillator();
                const gain = audioContext.createGain();

                oscillator.type = "sine";

                oscillator.frequency.setValueAtTime(
                    frequency,
                    startTime
                );

                gain.gain.setValueAtTime(0.001, startTime);

                gain.gain.exponentialRampToValueAtTime(
                    0.12,
                    startTime + 0.02
                );

                gain.gain.exponentialRampToValueAtTime(
                    0.001,
                    startTime + duration
                );

                oscillator.connect(gain);
                gain.connect(audioContext.destination);

                oscillator.start(startTime);
                oscillator.stop(startTime + duration);
            }

            playTone(660, now, 0.18);
            playTone(880, now + 0.2, 0.22);

            window.setTimeout(() => {
                audioContext.close();
            }, 700);
        } catch (error) {
            console.warn("Notification sound unavailable:", error);
        }
    }

    // MARK A NOTIFICATION AS READ.
    async function handleMarkAsRead(notificationId) {
        try {
            const response = await apiRequest(
                `/api/notifications/${notificationId}/read`,
                {
                    method: "PATCH",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to mark notification as read."
                );
            }

            setNotifications(previous =>
                previous.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, is_read: 1 }
                        : notification
                )
            );

            setUnreadCount(previous => Math.max(0, previous - 1));
        } catch (error) {
            setNotificationError(error.message);
        }
    }

    // Listen for incoming real-time notifications.
    useEffect(() => {
        if (!socket) return;

        function handleIncomingNotification(notification) {
            // Add the new notification to the top of the list.
            setNotifications(previous => [
                {
                    ...notification,
                    is_read: 0,
                    sender_name: "Administrator",
                    created_at: notification.createdAt || new Date().toISOString(),
                },
                ...previous,
            ]);

            // Increase the unread notification count.
            setUnreadCount(previous => previous + 1);

            // Play a sound for the incoming notification.
            playNotificationSound();

            console.log("New Admin notification received:", notification);
        }

        socket.on("notification", handleIncomingNotification);

        return () => {
            socket.off("notification", handleIncomingNotification);
        };
    }, [socket]);

    async function handleNotificationClick() {
        const willOpen = !showNotifications;

        setShowNotifications(willOpen);

        if (willOpen) {
            await fetchNotifications();
        }
    }

    async function handlePictureUpload(event) {
        const file = event.target.files[0];

        if (!file) return;

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            setError("Please select a JPG, PNG or WEBP image.");
            event.target.value = "";
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError("Image size must not exceed 2 MB.");
            event.target.value = "";
            return;
        }

        const formData = new FormData();
        formData.append("profile_picture", file);

        try {
            setUploading(true);
            setError("");

            const response = await apiRequest("/api/profile/picture", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Picture upload failed.");
            }

            onUserUpdate({
                ...user,
                profile_picture: data.profile_picture,
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setUploading(false);
            event.target.value = "";
        }
    }

    async function handleAvatarChange(avatarType) {
        try {
            setError("");

            const response = await apiRequest("/api/profile/avatar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    avatar_type: avatarType,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Avatar update failed.");
            }

            onUserUpdate({
                ...user,
                avatar_type: data.avatar_type,
                profile_picture: null,
            });

            setShowAvatarOptions(false);
        } catch (error) {
            setError(error.message);
        }
    }

    async function handleRemovePicture() {
        try {
            setError("");

            const response = await apiRequest("/api/profile/picture", {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to remove picture.");
            }

            onUserUpdate({
                ...user,
                profile_picture: null,
            });
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <header className="dashboard-header">
            <div className="header-title">
                <h1>{title}</h1>
                <p>{subtitle}</p>
            </div>

            <div className="header-actions">
                {showProductFilters && (
                    <div className="products-toolbar">
                        <div className="products-search">
                            <span>⌕</span>

                            <input
                                type="text"
                                placeholder="Search products or categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="all">All Categories</option>

                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>

                        <select
                            value={stockFilter}
                            onChange={(e) => setStockFilter(e.target.value)}
                        >
                            <option value="all">All Stock Levels</option>
                            <option value="in">In Stock</option>
                            <option value="low">Low Stock</option>
                            <option value="out">Out of Stock</option>
                        </select>
                    </div>
                )}

                <div className="notification-container">
                    <button
                        className="notification-button"
                        type="button"
                        onClick={handleNotificationClick}
                    >
                        🔔

                        {unreadCount > 0 && (
                            <span className="notification-badge">
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="notification-dropdown">
                            <div className="notification-dropdown-header">
                                <h3>Notifications</h3>

                                {unreadCount > 0 && (
                                    <span>{unreadCount} unread</span>
                                )}
                            </div>

                            {loadingNotifications ? (
                                <p className="no-notifications">
                                    Loading notifications...
                                </p>
                            ) : notificationError ? (
                                <p className="notification-error">
                                    {notificationError}
                                </p>
                            ) : notifications.length === 0 ? (
                                <p className="no-notifications">
                                    You have no notifications.
                                </p>
                            ) : (
                                <div className="notification-list">
                                    {notifications.map((notification) => (
                                        <div
                                            className={`notification-item ${
                                                notification.is_read
                                                    ? "notification-read"
                                                    : "notification-unread"
                                            }`}
                                            key={notification.id}
                                        >
                                            <div className="notification-message-header">
                                                <strong>
                                                    {notification.sender_name || "Administrator"}
                                                </strong>

                                                {!notification.is_read && (
                                                    <span className="unread-indicator"></span>
                                                )}
                                            </div>

                                            <p>{notification.message}</p>

                                            <span className="notification-date">
                                                {new Date(
                                                    notification.created_at || notification.createdAt
                                                ).toLocaleString()}
                                            </span>

                                            {!notification.is_read && (
                                                <button
                                                    className="mark-read-button"
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="user-profile" ref={menuRef}>
                    <button
                        type="button"
                        className="profile-trigger"
                        onClick={() => setShowProfileMenu(prev => !prev)}
                    >
                        <div className="user-avatar">
                            {user?.profile_picture ? (
                                <img
                                    src={`/uploads/${user.profile_picture}`}
                                    alt="Profile"
                                    className="profile-picture"
                                />
                            ) : (
                                user?.avatar_type === "male" ? "👨" :
                                user?.avatar_type === "female" ? "👩" : "👤"
                            )}
                        </div>

                        <div className="user-info">
                            <strong>{displayName}</strong>
                            <small>{role}</small>
                        </div>
                    </button>

                    {showProfileMenu && (
                        <div className="profile-dropdown">
                            <h3>My Profile</h3>

                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                disabled={uploading}
                            >
                                {uploading
                                    ? "Uploading..."
                                    : "Upload / Change Picture"}
                            </button>

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                ref={fileInputRef}
                                onChange={handlePictureUpload}
                                hidden
                            />

                            <button
                                type="button"
                                onClick={() => setShowAvatarOptions(prev => !prev)}
                            >
                                Choose Default Avatar
                            </button>

                            {showAvatarOptions && (
                                <div className="avatar-options">
                                    <button
                                        type="button"
                                        onClick={() => handleAvatarChange("male")}
                                    >
                                        👨 Male
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleAvatarChange("female")}
                                    >
                                        👩 Female
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleAvatarChange("generic")}
                                    >
                                        👤 Generic
                                    </button>
                                </div>
                            )}

                            {user?.profile_picture && (
                                <button
                                    type="button"
                                    onClick={handleRemovePicture}
                                >
                                    Remove Picture
                                </button>
                            )}

                            {error && (
                                <p className="profile-error">{error}</p>
                            )}

                            <hr />

                            <button
                                type="button"
                                className="logout-dropdown-button"
                                onClick={onLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;