function Login() {

    const handleLogin = () => {

        window.location.href =
            "http://localhost:8000/auth/login";
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#0f172a",
                color: "white",
            }}
        >
            <div
                style={{
                    backgroundColor: "#1e293b",
                    padding: "40px",
                    borderRadius: "20px",
                    textAlign: "center",
                }}
            >
                <h1>
                    💰 Bank Turnover Analyzer
                </h1>

                <p>
                    Analyze your bank statements automatically
                </p>

                <button
                    onClick={handleLogin}
                    style={{
                        padding: "12px 24px",
                        borderRadius: "10px",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                    }}
                >
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}

export default Login;