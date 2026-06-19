import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
    { to: "/", icon: "⊞", label: "Dashboard" },
    { to: "/reports", icon: "📊", label: "Reports" },
];

const SIDEBAR_W = 220;
const COLLAPSED_W = 64;

function Sidebar({ onSync, onLogout, syncing, theme, onToggleTheme, collapsed, onToggleCollapse }) {
    const location = useLocation();
    const styles = getSidebarStyles(theme, collapsed);

    return (
        <>
            <div style={styles.wrapper}>
                <div style={styles.sidebar}>
                    {/* Brand + collapse toggle */}
                    <div style={styles.header}>
                        {!collapsed && (
                            <span style={styles.brand}>
                                <span style={styles.brandAccent}>💰</span>
                                <span style={styles.brandText}>Turnover</span>
                            </span>
                        )}
                        <button
                            style={styles.collapseBtn}
                            onClick={onToggleCollapse}
                            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            <svg
                                width="14" height="14" viewBox="0 0 14 14" fill="none"
                                style={{
                                    transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "transform 0.3s ease",
                                }}
                            >
                                <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.8"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <div style={styles.divider} />

                    {/* Nav links */}
                    <nav style={styles.nav}>
                        {NAV_ITEMS.map(({ to, icon, label }) => {
                            const active = location.pathname === to;
                            return (
                                <Link
                                    key={to}
                                    to={to}
                                    style={{
                                        ...styles.navItem,
                                        ...(active ? styles.navItemActive : {}),
                                    }}
                                    title={collapsed ? label : undefined}
                                >
                                    {active && <span style={styles.activeBar} />}
                                    <span style={styles.navIcon}>{icon}</span>
                                    {!collapsed && <span style={styles.navLabel}>{label}</span>}
                                </Link>
                            );
                        })}

                        <button
                            style={{
                                ...styles.navItem,
                                ...styles.navButton,
                                ...(syncing ? styles.navButtonSyncing : {}),
                            }}
                            onClick={onSync}
                            disabled={syncing}
                            title={collapsed ? "Sync Statements" : undefined}
                        >
                            <span style={{
                                ...styles.navIcon,
                                display: "inline-block",
                                animation: syncing ? "spin 1s linear infinite" : "none",
                            }}>🔄</span>
                            {!collapsed && (
                                <span style={styles.navLabel}>
                                    {syncing ? "Syncing…" : "Sync Statements"}
                                </span>
                            )}
                        </button>
                    </nav>

                    {/* Bottom actions */}
                    <div style={styles.bottom}>
                        <div style={styles.divider} />

                        <button
                            style={{ ...styles.navItem, ...styles.navButton }}
                            onClick={onToggleTheme}
                            title={collapsed ? (theme === "dark" ? "Light mode" : "Dark mode") : undefined}
                        >
                            <span style={styles.navIcon}>{theme === "dark" ? "☀️" : "🌙"}</span>
                            {!collapsed && (
                                <span style={styles.navLabel}>
                                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                                </span>
                            )}
                        </button>

                        <button
                            style={{ ...styles.navItem, ...styles.navButton, ...styles.logoutBtn }}
                            onClick={onLogout}
                            title={collapsed ? "Logout" : undefined}
                        >
                            <span style={styles.navIcon}>↩</span>
                            {!collapsed && <span style={styles.navLabel}>Logout</span>}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                a { text-decoration: none !important; color: inherit !important; }
            `}</style>
        </>
    );
}

function getSidebarStyles(theme, collapsed) {
    const dark = theme !== "light";
    const W = collapsed ? `${COLLAPSED_W}px` : `${SIDEBAR_W}px`;

    const glass = dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.55)";
    const glassBorder = dark ? "1px solid rgba(255,255,255,0.09)" : "1px solid rgba(0,0,0,0.08)";
    const textMuted = dark ? "#64748b" : "#94a3b8";
    const hoverBg = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
    const activeBg = dark ? "rgba(99,102,241,0.18)" : "rgba(99,102,241,0.10)";
    const activeText = "#818cf8";
    const dividerColor = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";

    return {
        wrapper: {
            width: W,
            minWidth: W,
            flexShrink: 0,
            transition: "width 0.3s cubic-bezier(0.4,0,0.2,1), min-width 0.3s cubic-bezier(0.4,0,0.2,1)",
        },
        sidebar: {
            width: W,
            minHeight: "100vh",
            backgroundColor: glass,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRight: glassBorder,
            boxSizing: "border-box",
            padding: collapsed ? "24px 10px" : "24px 14px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            transition: "width 0.3s cubic-bezier(0.4,0,0.2,1), padding 0.3s ease",
            overflow: "hidden",
            position: "fixed",
            top: 0, left: 0, bottom: 0,
            zIndex: 100,
        },
        header: {
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            marginBottom: "8px",
            gap: "8px",
        },
        brand: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            overflow: "hidden",
            whiteSpace: "nowrap",
        },
        brandAccent: { fontSize: "20px", flexShrink: 0 },
        brandText: {
            fontWeight: 700,
            fontSize: "15px",
            background: "linear-gradient(135deg,#818cf8,#d946ef)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.02em",
        },
        collapseBtn: {
            background: hoverBg,
            border: glassBorder,
            borderRadius: "8px",
            color: textMuted,
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: 0,
            flexShrink: 0,
            transition: "background 0.2s",
        },
        divider: {
            height: "1px",
            backgroundColor: dividerColor,
            margin: "8px 0",
        },
        nav: {
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            flex: 1,
        },
        navItem: {
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: collapsed ? "10px" : "9px 10px",
            borderRadius: "10px",
            color: textMuted,
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "background 0.18s, color 0.18s",
            whiteSpace: "nowrap",
            overflow: "hidden",
            justifyContent: collapsed ? "center" : "flex-start",
            textDecoration: "none",
        },
        navItemActive: {
            backgroundColor: activeBg,
            color: activeText,
        },
        activeBar: {
            position: "absolute",
            left: 0, top: "20%", bottom: "20%",
            width: "3px",
            borderRadius: "0 3px 3px 0",
            background: "linear-gradient(180deg,#6366f1,#d946ef)",
        },
        navIcon: {
            fontSize: "15px",
            flexShrink: 0,
            width: "18px",
            textAlign: "center",
        },
        navLabel: { overflow: "hidden", textOverflow: "ellipsis", color: "inherit" },
        navButton: {
            background: "none",
            border: "none",
            width: "100%",
            textAlign: "left",
            fontFamily: "inherit",
        },
        navButtonSyncing: { color: "#818cf8" },
        bottom: { display: "flex", flexDirection: "column", gap: "2px" },
        logoutBtn: { color: dark ? "#f87171" : "#ef4444" },
    };
}

export { SIDEBAR_W, COLLAPSED_W };
export default Sidebar;