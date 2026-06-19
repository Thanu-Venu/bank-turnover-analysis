function UserProfile({ user, theme = "dark" }) {
    const dark = theme !== "light";

    const glass = dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.65)";
    const border = dark
        ? "1px solid rgba(255,255,255,0.10)"
        : "1px solid rgba(0,0,0,0.07)";
    const namColor = dark ? "#f1f5f9" : "#0f172a";
    const emailColor = dark ? "#64748b" : "#94a3b8";

    /* derive initials for avatar fallback */
    const initials = user?.name
        ? user.name
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase()
        : "U";

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                backgroundColor: glass,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border,
                borderRadius: "14px",
                padding: "10px 16px 10px 10px",
                boxShadow: dark
                    ? "0 4px 20px rgba(0,0,0,0.20)"
                    : "0 4px 20px rgba(0,0,0,0.06)",
                transition: "background-color 0.3s ease",
            }}
        >
            {/* Avatar with gradient ring */}
            <div
                style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    padding: "2px",
                    background: "linear-gradient(135deg, #6366f1, #d946ef)",
                    flexShrink: 0,
                }}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        backgroundColor: dark ? "#0f172a" : "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: 700,
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        color: "#fff",
                    }}
                >
                    {initials}
                </div>
            </div>

            {/* Name + email */}
            <div style={{ minWidth: 0 }}>
                <p
                    style={{
                        margin: 0,
                        fontSize: "13px",
                        fontWeight: 700,
                        color: namColor,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "180px",
                    }}
                >
                    {user?.name}
                </p>
                <p
                    style={{
                        margin: "2px 0 0",
                        fontSize: "11px",
                        color: emailColor,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "180px",
                    }}
                >
                    {user?.email}
                </p>
            </div>

            {/* Online indicator dot */}
            <div
                style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    backgroundColor: "#10b981",
                    boxShadow: "0 0 6px #10b981",
                    flexShrink: 0,
                    marginLeft: "4px",
                }}
            />
        </div>
    );
}

export default UserProfile;