import { useEffect, useState } from "react";
import api from "../services/api";
import SummaryCard from "../components/SummaryCard";
import MonthlyTrendChart from "../components/MonthlyTrendChart";
import RecentTransactions from "../components/RecentTransactions";
import Sidebar, { SIDEBAR_W, COLLAPSED_W } from "../components/Sidebar";
import UserProfile from "../components/UserProfile";

/* ─── theme tokens ─────────────────────────────────────────────────────────── */
const THEMES = {
    dark: {
        bgGradient:
            "radial-gradient(ellipse 80% 60% at 20% -10%, #1e1b4b 0%, transparent 60%)," +
            "radial-gradient(ellipse 60% 50% at 80% 110%, #1a0533 0%, transparent 55%)," +
            "#050d1a",
        headerTitle: "#f1f5f9",
        headerSub: "#64748b",
        notifBg: "rgba(16,185,129,0.15)",
        notifBorder: "1px solid rgba(16,185,129,0.35)",
        notifText: "#34d399",
        text: "#f1f5f9",
    },
    light: {
        bgGradient:
            "radial-gradient(ellipse 80% 60% at 20% -10%, #c7d2fe 0%, transparent 60%)," +
            "radial-gradient(ellipse 60% 50% at 80% 110%, #e9d5ff 0%, transparent 55%)," +
            "#f0f4ff",
        headerTitle: "#0f172a",
        headerSub: "#64748b",
        notifBg: "rgba(16,185,129,0.12)",
        notifBorder: "1px solid rgba(16,185,129,0.30)",
        notifText: "#059669",
        text: "#0f172a",
    },
};

const formatCurrency = (value) =>
    new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: "LKR",
        minimumFractionDigits: 2,
    }).format(value);

function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [trend, setTrend] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [syncing, setSyncing] = useState(false);
    const [syncMessage, setSyncMessage] = useState(null);
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState("dark");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const t = THEMES[theme];
    const sidebarWidth = sidebarCollapsed ? COLLAPSED_W : SIDEBAR_W;

    useEffect(() => {
        api.get("/dashboard/summary").then((r) => setSummary(r.data)).catch(console.error);
        api.get("/dashboard/monthly-trend").then((r) => setTrend(r.data)).catch(console.error);
        api.get("/dashboard/recent-transactions").then((r) => setRecentTransactions(r.data)).catch(console.error);
        api.get("/auth/me").then((r) => {
            if (r.data.error) { window.location.href = "/login"; return; }
            setUser(r.data);
        });
    }, []);

    const handleSync = () => {
        setSyncing(true);
        api.get("/gmail/process-all")
            .then((r) => {
                setSyncMessage(
                    `Sync complete · Processed ${r.data.processed_emails} · Skipped ${r.data.skipped_emails} · ${r.data.total_transactions} transactions`
                );
                setTimeout(() => setSyncMessage(null), 5000);
            })
            .finally(() => setSyncing(false));
    };

    const handleLogout = () =>
        api.get("/auth/logout").then(() => { window.location.href = "/login"; });

    if (!summary) {
        return (
            <div style={{
                minHeight: "100vh",
                background: THEMES.dark.bgGradient,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: "20px",
            }}>
                <div style={loadingSpinnerStyle} />
                <p style={{ color: "#64748b", fontSize: "14px", letterSpacing: "0.05em" }}>
                    Loading dashboard…
                </p>
                <style>{`@keyframes dashSpin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={{
            display: "flex",
            minHeight: "100vh",
            background: t.bgGradient,
            color: t.text,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            transition: "background 0.4s ease, color 0.3s ease",
        }}>
            <Sidebar
                onSync={handleSync}
                onLogout={handleLogout}
                syncing={syncing}
                theme={theme}
                onToggleTheme={() => setTheme((p) => (p === "dark" ? "light" : "dark"))}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
            />

            {/* Main — margin tracks sidebar width exactly */}
            <main style={{
                flex: 1,
                minWidth: 0,
                marginLeft: 0,
                transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1)",
                boxSizing: "border-box",
                padding: "36px 40px",
            }}>
                <div
                    style={{
                        width: "100%",
                        maxWidth: "1600px",
                    }}
                >
                    {/* Sync notification */}
                    {syncMessage && (
                        <div style={{
                            backgroundColor: t.notifBg,
                            border: t.notifBorder,
                            color: t.notifText,
                            padding: "13px 18px",
                            borderRadius: "12px",
                            marginBottom: "24px",
                            fontSize: "13px",
                            fontWeight: 600,
                            backdropFilter: "blur(10px)",
                            display: "flex", alignItems: "center", gap: "8px",
                        }}>
                            ✅ {syncMessage}
                        </div>
                    )}

                    {/* Header */}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "28px",
                        gap: "16px",
                    }}>
                        <div style={{ minWidth: 0 }}>
                            <p style={{
                                fontSize: "10px", fontWeight: 700,
                                letterSpacing: "0.13em", textTransform: "uppercase",
                                color: "#818cf8", margin: "0 0 6px",
                            }}>
                                Financial Overview
                            </p>
                            <h1 style={{
                                fontSize: "28px", fontWeight: 800,
                                margin: 0, letterSpacing: "-0.03em",
                                color: t.headerTitle, lineHeight: 1.15,
                            }}>
                                Bank Turnover Analyzer
                            </h1>
                            <p style={{
                                marginTop: "6px", marginBottom: 0,
                                fontSize: "12px", color: t.headerSub,
                                display: "flex", alignItems: "center", gap: "6px",
                            }}>
                                <span style={{
                                    display: "inline-block", width: "6px", height: "6px",
                                    borderRadius: "50%", flexShrink: 0,
                                    background: "linear-gradient(135deg,#6366f1,#d946ef)",
                                }} />
                                Statement period: {summary.first_transaction} → {summary.last_transaction}
                            </p>
                        </div>

                        {user && !user.error && (
                            <div style={{ flexShrink: 0 }}>
                                <UserProfile user={user} theme={theme} />
                            </div>
                        )}
                    </div>

                    {/* Summary cards — 4 equal columns */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: "14px",
                        marginBottom: "20px",
                    }}>
                        <SummaryCard
                            title="Transactions"
                            value={summary.total_transactions}
                            icon="🔢" accent="indigo" theme={theme}
                        />
                        <SummaryCard
                            title="Total Debits"
                            value={formatCurrency(summary.total_debits)}
                            icon="📤" accent="red" theme={theme}
                        />
                        <SummaryCard
                            title="Total Credits"
                            value={formatCurrency(summary.total_credits)}
                            icon="📥" accent="green" theme={theme}
                        />
                        <SummaryCard
                            title="Net Flow"
                            value={formatCurrency(summary.net_flow)}
                            icon={summary.net_flow >= 0 ? "📈" : "📉"}
                            accent={summary.net_flow >= 0 ? "green" : "red"}
                            theme={theme}
                        />
                    </div>

                    {/* Chart */}
                    <GlassPanel theme={theme} style={{ marginBottom: "20px" }}>
                        <SectionLabel>Monthly Trend</SectionLabel>
                        <MonthlyTrendChart data={trend} theme={theme} />
                    </GlassPanel>

                    {/* Transactions */}
                    <GlassPanel theme={theme}>
                        <SectionLabel>Recent Transactions</SectionLabel>
                        <RecentTransactions transactions={recentTransactions} theme={theme} />
                    </GlassPanel>

                </div>
            </main>
        </div>
    );
}

function GlassPanel({ theme, children, style = {} }) {
    const dark = theme !== "light";
    return (
        <div style={{
            backgroundColor: dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.6)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: dark ? "1px solid rgba(255,255,255,0.09)" : "1px solid rgba(0,0,0,0.07)",
            borderRadius: "20px",
            padding: "24px 28px",
            boxShadow: dark ? "0 4px 24px rgba(0,0,0,0.25)" : "0 4px 24px rgba(0,0,0,0.06)",
            transition: "background-color 0.3s ease",
            ...style,
        }}>
            {children}
        </div>
    );
}

function SectionLabel({ children }) {
    return (
        <p style={{
            fontSize: "10px", fontWeight: 700,
            letterSpacing: "0.10em", textTransform: "uppercase",
            color: "#818cf8", marginBottom: "16px", marginTop: 0,
        }}>
            {children}
        </p>
    );
}

const loadingSpinnerStyle = {
    width: "40px", height: "40px", borderRadius: "50%",
    border: "3px solid rgba(99,102,241,0.2)", borderTopColor: "#6366f1",
    animation: "dashSpin 0.9s linear infinite",
};

export default Dashboard;