function UserProfile({ user }) {
    return (
        <div
            style={{
                backgroundColor: "#1e293b",
                padding: "15px 20px",
                borderRadius: "15px",
                minWidth: "250px",
                textAlign: "center",
                boxShadow: "0 0 15px rgba(0,0,0,0.3)",
            }}
        >
            <div
                style={{
                    fontSize: "35px",
                    marginBottom: "8px",
                }}
            >
                👤
            </div>

            <h3
                style={{
                    margin: "0",
                }}
            >
                {user.name}
            </h3>

            <p
                style={{
                    color: "#94a3b8",
                    fontSize: "14px",
                    marginTop: "5px",
                }}
            >
                {user.email}
            </p>
        </div>
    );
}

export default UserProfile;