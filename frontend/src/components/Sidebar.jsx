import { Link } from "react-router-dom";
function Sidebar({ onSync,onLogout }) {
    return (
        <div
            style={{
                width: "250px",
                backgroundColor: "#111827",
                color: "white",
                minHeight: "100vh",
                padding: "30px",
                boxSizing: "border-box",
            }}
        >
            <h2
                style={{
                    marginBottom: "40px",
                }}
            >
                💰 Turnover Analyzer
            </h2>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}
            >
                <button
                    style={{
                        backgroundColor: "#1e293b",
                        color: "white",
                        border: "none",
                        padding: "12px",
                        borderRadius: "10px",
                        cursor: "pointer",
                    }}
                >
                    <Link to="/">Dashboard</Link>
                </button>

                <button style={{
                    backgroundColor: "#1e293b",
                    color: "white",
                    border: "none",
                    padding: "12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                }}><Link to="/reports">Reports</Link>
                </button>

                <button  onClick={onSync} style={{
                    backgroundColor: "#1e293b",
                    color: "white",
                    border: "none",
                    padding: "12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                }}>
                    Sync Statements
                </button>

                <button style={{
                    backgroundColor: "#1e293b",
                    color: "white",
                    border: "none",
                    padding: "12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                }} onClick={onLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Sidebar;