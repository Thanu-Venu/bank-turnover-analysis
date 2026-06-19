import { useEffect, useState } from "react";
import api from "../services/api";
import SummaryCard from "../components/SummaryCard";
import MonthlyTrendChart from "../components/MonthlyTrendChart";
import RecentTransactions from "../components/RecentTransactions";
import Sidebar from "../components/Sidebar";
import UserProfile from "../components/UserProfile";

function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [trend, setTrend] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [syncing, setSyncing] = useState(false);
    const handleSync = () => {
        setSyncing(true);
        api
            .get("/gmail/process-all")
            .then((response) => {

                setSyncMessage(
                    `✅ Sync Complete | Processed: ${response.data.processed_emails} | Skipped: ${response.data.skipped_emails} | Transactions: ${response.data.total_transactions}`
                );

                setTimeout(() => {
                    setSyncMessage(null);
                }, 5000);
            })
            .finally(() => {
                setSyncing(false);
            });
    };

    const [user, setUser] =
        useState(null);

    const handleLogout = () => {

        api
            .get("/auth/logout")
            .then(() => {

                window.location.href =
                    "http://localhost:5173/login";

            });
    };

    const [syncMessage, setSyncMessage] = useState(null);

    useEffect(() => {
        api
            .get("/dashboard/summary")
            .then((response) => {
                setSummary(response.data);
            })
            .catch((error) => {
                console.error(error);
            });

        api
            .get("/dashboard/monthly-trend")
            .then((response) => {
                setTrend(response.data);
            })
            .catch((error) => {
                console.error(error);
            });

        api
            .get("/dashboard/recent-transactions")
            .then((response) => {
                setRecentTransactions(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
        api
            .get("/auth/me")
            .then((response) => {

                if (response.data.error) {

                    window.location.href =
                        "/login";

                    return;
                }

                setUser(response.data);
            });
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-LK", {
            style: "currency",
            currency: "LKR",
            minimumFractionDigits: 2,
        }).format(value);
    };

    if (!summary) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#0f172a",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "24px",
                }}
            >

                Loading Dashboard...
            </div>
        );
    }
    console.log("USER DATA:", user);

    return (
        <div
            style={{
                display: "flex",
                backgroundColor: "#0f172a",
                color: "white",
            }}
        >
            <Sidebar
                onSync={handleSync}
                onLogout={handleLogout}
                syncing={syncing}
            />

            <div
                style={{
                    flex: 1,
                    padding: "40px",
                }}
            >
                <div
                    style={{
                        minHeight: "100vh",
                        backgroundColor: "#0f172a",
                        color: "white",
                        fontFamily: "Arial, sans-serif",
                    }}
                >

                    {/* Sync Success Notification */}

                    {syncMessage && (
                        <div
                            style={{
                                backgroundColor: "#166534",
                                color: "white",
                                padding: "15px",
                                borderRadius: "10px",
                                marginBottom: "20px",
                                textAlign: "center",
                                fontWeight: "bold",
                            }}
                        >
                            {syncMessage}
                        </div>
                    )}

                    {/* Header */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "40px",
                        }}
                    >
                        <div>
                            <h1
                                style={{
                                    fontSize: "42px",
                                    margin: 0,
                                }}
                            >
                                💰 Bank Turnover Analyzer
                            </h1>

                            <p
                                style={{
                                    color: "#94a3b8",
                                    marginTop: "10px",
                                }}
                            >
                                Statement Period:
                                {" "}
                                {summary.first_transaction}
                                {" → "}
                                {summary.last_transaction}
                            </p>
                        </div>

                        {user &&
                            !user.error && (
                                <UserProfile
                                    user={user}
                                />
                            )}
                    </div>

                    {/* Summary Cards */}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit,minmax(260px,1fr))",
                            gap: "25px",
                            marginBottom: "50px",
                        }}
                    >
                        <SummaryCard
                            title="Transactions"
                            value={summary.total_transactions}
                            background="#1e293b"
                        />

                        <SummaryCard
                            title="Total Debits"
                            value={formatCurrency(
                                summary.total_debits
                            )}
                            background="#334155"
                        />

                        <SummaryCard
                            title="Total Credits"
                            value={formatCurrency(
                                summary.total_credits
                            )}
                            background="#14532d"
                        />

                        <SummaryCard
                            title="Net Flow"
                            value={formatCurrency(
                                summary.net_flow
                            )}
                            background={
                                summary.net_flow >= 0
                                    ? "#166534"
                                    : "#7f1d1d"
                            }
                        />
                    </div>

                    {/* Monthly Trend Chart */}

                    <div
                        style={{
                            backgroundColor: "#1e293b",
                            borderRadius: "20px",
                            padding: "30px",
                            boxShadow:
                                "0 0 20px rgba(0,0,0,0.3)",
                            marginBottom: "40px",
                        }}
                    >
                        <MonthlyTrendChart
                            data={trend}
                        />
                    </div>

                    {/* Recent Transactions */}

                    <RecentTransactions
                        transactions={
                            recentTransactions
                        }
                    />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;