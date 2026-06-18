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
    const handleSync = () => {
        api
            .get("/gmail/process-all")
            .then((response) => {
                alert(
                    JSON.stringify(
                        response.data,
                        null,
                        2
                    )
                );
            });
    };

    const [user, setUser] =
        useState(null);

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
            <Sidebar onSync={handleSync} />
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
                padding: "40px",
                fontFamily: "Arial, sans-serif",
            }}
        >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "40px",
                        }}
                    >
                        <div>
                            <h3
                                style={{
                                    fontSize: "30px",
                                    margin: 0,
                                }}
                            >
                                Bank Turnover Analyzer
                            </h3>

                            <p
                                style={{
                                    color: "#94a3b8",
                                    marginTop: "10px",
                                }}
                            >
                                Statement Period: {summary.first_transaction} → {summary.last_transaction}
                            </p>
                        </div>

                        {user && <UserProfile user={user} />}
                    </div>

            {/* Summary Cards */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
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
                    value={formatCurrency(summary.total_debits)}
                    background="#334155"
                />

                <SummaryCard
                    title="Total Credits"
                    value={formatCurrency(summary.total_credits)}
                    background="#14532d"
                />

                <SummaryCard
                    title="Net Flow"
                    value={formatCurrency(summary.net_flow)}
                    background={
                        summary.net_flow >= 0
                            ? "#166534"
                            : "#7f1d1d"
                    }
                />
            </div>

            {/* Chart Section */}

            <div
                style={{
                    backgroundColor: "#1e293b",
                    borderRadius: "20px",
                    padding: "30px",
                    boxShadow: "0 0 20px rgba(0,0,0,0.3)",
                }}
            >
                <MonthlyTrendChart data={trend} />
            </div>

            {/* Recent Transactions Section */}

            <RecentTransactions transactions={recentTransactions} />
            </div>
        </div>
        </div>
    );
}

export default Dashboard;