function Settings({ user }) {
    return (
        <section className="settings-page">
            <div className="page-heading">
                <h2>Account Settings</h2>
                <p>View your account information and profile settings.</p>
            </div>

            <div className="settings-card">
                <h3>Personal Information</h3>

                <div className="settings-information">
                    <div>
                        <span>First Name</span>
                        <strong>{user?.name || "Not available"}</strong>
                    </div>

                    <div>
                        <span>Surname</span>
                        <strong>{user?.surname || "Not available"}</strong>
                    </div>

                    <div>
                        <span>Email Address</span>
                        <strong>{user?.email || "Not available"}</strong>
                    </div>

                    <div>
                        <span>Account Role</span>
                        <strong>{user?.role || "Not available"}</strong>
                    </div>

                    <div>
                        <span>Account ID</span>
                        <strong>{user?.id || "Not available"}</strong>
                    </div>
                </div>
            </div>

            <div className="settings-card">
                <h3>Profile Appearance</h3>

                <p>
                    You can customise how your profile appears in StockFlow
                    using your profile menu in the top-right corner.
                </p>

                <ul>
                    <li>Upload or change your profile picture.</li>
                    <li>Choose a default avatar.</li>
                    <li>Remove your uploaded profile picture.</li>
                </ul>
            </div>

            <div className="settings-card">
                <h3>Security</h3>

                <p>
                    Your account is protected by authenticated sessions
                    and role-based access control.
                </p>

                <p>
                    Always log out when using a shared computer.
                </p>
            </div>
        </section>
    );
}

export default Settings;