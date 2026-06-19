import { useState } from "react";

function Login() {
    const [hovered, setHovered] = useState(false);

    const handleLogin = () => {
        window.location.href = "http://localhost:8000/auth/login";
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background:
                    "radial-gradient(ellipse 80% 60% at 20% -10%, #1e1b4b 0%, transparent 60%)," +
                    "radial-gradient(ellipse 60% 50% at 80% 110%, #1a0533 0%, transparent 55%)," +
                    "#050d1a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
                fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
        >
            {/* Glassmorphism card */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "400px",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: "24px",
                    padding: "48px 40px 44px",
                    boxShadow:
                        "0 8px 40px rgba(0,0,0,0.40), 0 0 0 1px rgba(255,255,255,0.04) inset",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Subtle inner glow */}
                <div
                    style={{
                        position: "absolute",
                        top: "-60px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "240px",
                        height: "160px",
                        background:
                            "radial-gradient(ellipse, rgba(99,102,241,0.20) 0%, transparent 70%)",
                        pointerEvents: "none",
                    }}
                />

                {/* Logo mark */}
                <div
                    style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "16px",
                        background: "linear-gradient(135deg, #6366f1, #d946ef)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "28px",
                        margin: "0 auto 24px",
                        boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
                    }}
                >
                    💰
                </div>

                {/* Heading */}
                <h1
                    style={{
                        margin: "0 0 10px",
                        fontSize: "24px",
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                        color: "#f1f5f9",
                        lineHeight: 1.2,
                    }}
                >
                    Bank Turnover Analyzer
                </h1>

                <p
                    style={{
                        margin: "0 0 36px",
                        fontSize: "14px",
                        color: "#64748b",
                        lineHeight: 1.6,
                    }}
                >
                    Connect your account to automatically analyze your bank statements and track cash flow.
                </p>

                {/* Divider */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "24px",
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            height: "1px",
                            background: "rgba(255,255,255,0.08)",
                        }}
                    />
                    <span
                        style={{
                            fontSize: "11px",
                            color: "#475569",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            fontWeight: 600,
                        }}
                    >
                        Continue with
                    </span>
                    <div
                        style={{
                            flex: 1,
                            height: "1px",
                            background: "rgba(255,255,255,0.08)",
                        }}
                    />
                </div>

                {/* Google sign-in button */}
                <button
                    onClick={handleLogin}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    style={{
                        width: "100%",
                        padding: "13px 20px",
                        borderRadius: "12px",
                        border: hovered
                            ? "1px solid rgba(255,255,255,0.20)"
                            : "1px solid rgba(255,255,255,0.12)",
                        background: hovered
                            ? "rgba(255,255,255,0.10)"
                            : "rgba(255,255,255,0.06)",
                        color: "#f1f5f9",
                        fontSize: "14px",
                        fontWeight: 600,
                        fontFamily: "inherit",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        backdropFilter: "blur(8px)",
                        transition: "background 0.2s ease, border 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease",
                        transform: hovered ? "translateY(-1px)" : "translateY(0)",
                        boxShadow: hovered
                            ? "0 6px 20px rgba(0,0,0,0.25)"
                            : "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                >
                    {/* Google G icon */}
                    <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                        <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v8.9h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.4z" />
                        <path fill="#34A853" d="M24 48c6.5 0 12-2.1 16-5.8l-7.9-6c-2.2 1.5-5 2.3-8.1 2.3-6.2 0-11.4-4.2-13.3-9.8H2.6v6.2C6.6 42.8 14.8 48 24 48z" />
                        <path fill="#FBBC05" d="M10.7 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7v-6.2H2.6C.9 16.6 0 20.2 0 24s.9 7.4 2.6 10.9l8.1-6.2z" />
                        <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.8 0 6.6 5.2 2.6 13.1l8.1 6.2C12.6 13.7 17.8 9.5 24 9.5z" />
                    </svg>
                    Sign in with Google
                </button>

                {/* Footer note */}
                <p
                    style={{
                        marginTop: "24px",
                        marginBottom: 0,
                        fontSize: "11px",
                        color: "#475569",
                        lineHeight: 1.6,
                    }}
                >
                    Your data is encrypted and never shared.
                </p>
            </div>
        </div>
    );
}

export default Login;