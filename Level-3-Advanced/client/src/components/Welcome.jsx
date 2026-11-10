function Welcome({ user }) {
    const firstName = user?.name || "there";

    return (
        <section className="dashboard-welcome">
            <div>
                <h2>Welcome, {firstName}!</h2>

                <p>
                    Here's your inventory overview. Stay informed,
                    monitor your stock and keep your business moving.
                </p>
            </div>

            <div className="welcome-icon">
                📊
            </div>
        </section>
    );
}

export default Welcome;
