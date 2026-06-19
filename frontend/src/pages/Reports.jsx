import { useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

/* ─── shared tokens ─────────────────────────────────────────────────────────── */
const THEMES = {
    dark: {
        bgGradient:
            "radial-gradient(ellipse 80% 60% at 20% -10%, #1e1b4b 0%, transparent 60%)," +
            "radial-gradient(ellipse 60% 50% at 80% 110%, #1a0533 0%, transparent 55%)," +
            "#050d1a",
        glass: "rgba(255,255,255,0.05)",
        glassBorder: "1px solid rgba(255,255,255,0.10)",
        glassHover: "rgba(255,255,255,0.08)",
        inputBg: "rgba(255,255,255,0.06)",
        inputBorder: "1px solid rgba(255,255,255,0.10)",
        inputText: "#f1f5f9",
        labelText: "#64748b",
        titleText: "#f1f5f9",
        mutedText: "#475569",
        resultBg: "rgba(255,255,255,0.04)",
    },
    light: {
        bgGradient:
            "radial-gradient(ellipse 80% 60% at 20% -10%, #c7d2fe 0%, transparent 60%)," +
            "radial-gradient(ellipse 60% 50% at 80% 110%, #e9d5ff 0%, transparent 55%)," +
            "#f0f4ff",
        glass: "rgba(255,255,255,0.65)",
        glassBorder: "1px solid rgba(0,0,0,0.07)",
        glassHover: "rgba(255,255,255,0.85)",
        inputBg: "rgba(0,0,0,0.04)",
        inputBorder: "1px solid rgba(0,0,0,0.10)",
        inputText: "#0f172a",
        labelText: "#94a3b8",
        titleText: "#0f172a",
        mutedText: "#94a3b8",
        resultBg: "rgba(0,0,0,0.03)",
    },
};

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const YEARS = ["2026", "2025", "2024"];

const formatCurrency = (v) =>
    new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: "LKR",
        minimumFractionDigits: 2,
    }).format(v);

/* ─── styled select ─────────────────────────────────────────────────────────── */
function StyledSelect({ value, onChange, options, theme }) {
    const tk = THEMES[theme];
    return (
        <select
            value={value}
            onChange={onChange}
            style={{
                backgroundColor: tk.inputBg,
                border: tk.inputBorder,
                borderRadius: "10px",
                color: tk.inputText,
                fontSize: "13px",
                fontWeight: 500,
                padding: "9px 14px",
                fontFamily: "inherit",
                cursor: "pointer",
                outline: "none",
                appearance: "none",
                backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
                paddingRight: "32px",
                transition: "border 0.2s, background 0.2s",
            }}
        >
            {options.map(({ value: v, label }) => (
                <option key={v} value={v} style={{ background: theme === "dark" ? "#0f172a" : "#fff" }}>
                    {label}
                </option>
            ))}
        </select>
    );
}

/* ─── generate button ───────────────────────────────────────────────────────── */
function GenerateButton({ onClick, loading, children }) {
    const [hovered, setHovered] = useState(false);
    return (
        <button
            onClick={onClick}
            disabled={loading}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: hovered && !loading
                    ? "linear-gradient(135deg, #818cf8, #d946ef)"
                    : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                padding: "9px 18px",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                opacity: loading ? 0.7 : 1,
                transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
                transform: hovered && !loading ? "translateY(-1px)" : "translateY(0)",
                boxShadow: hovered && !loading
                    ? "0 4px 16px rgba(99,102,241,0.45)"
                    : "0 2px 8px rgba(99,102,241,0.25)",
                whiteSpace: "nowrap",
            }}
        >
            {loading ? "Generating…" : children}
        </button>
    );
}

/* ─── glass panel ────────────────────────────────────────────────────────────── */
function GlassPanel({ theme, children, style = {} }) {
    const tk = THEMES[theme];
    return (
        <div
            style={{
                backgroundColor: tk.glass,
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: tk.glassBorder,
                borderRadius: "20px",
                padding: "28px 30px",
                boxShadow:
                    theme !== "light"
                        ? "0 4px 24px rgba(0,0,0,0.25)"
                        : "0 4px 24px rgba(0,0,0,0.06)",
                transition: "background-color 0.3s ease",
                ...style,
            }}
        >
            {children}
        </div>
    );
}

/* ─── result stat row ────────────────────────────────────────────────────────── */
function StatRow({ label, value, accent, theme }) {
    const dark = theme !== "light";
    const ACCENTS = {
        red: ["#ef4444", "#f87171"],
        green: ["#10b981", "#34d399"],
        indigo: ["#6366f1", "#818cf8"],
    };
    const [a, b] = ACCENTS[accent] || ACCENTS.indigo;

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderRadius: "12px",
                background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                border: dark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.06)",
                gap: "16px",
            }}
        >
            <span
                style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: dark ? "#64748b" : "#94a3b8",
                }}
            >
                {label}
            </span>
            <span
                style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: b,
                    fontVariantNumeric: "tabular-nums",
                }}
            >
                {value}
            </span>
        </div>
    );
}

/* ─── main component ─────────────────────────────────────────────────────────── */
function Reports({ theme: propTheme }) {
    const [year, setYear] = useState("2026");
    const [month, setMonth] = useState("5");
    const [report, setReport] = useState(null);
    const [reportType, setReportType] = useState(null);
    const [loadingYearly, setLoadingYearly] = useState(false);
    const [loadingMonthly, setLoadingMonthly] = useState(false);
    const [theme, setTheme] = useState(propTheme || "dark");

    const tk = THEMES[theme];

    const getYearlyReport = () => {
        setLoadingYearly(true);
        api.get(`/reports/yearly/${year}`)
            .then((r) => { setReport(r.data); setReportType("yearly"); })
            .finally(() => setLoadingYearly(false));
    };

    const getMonthlyReport = () => {
        setLoadingMonthly(true);
        api.get(`/reports/monthly/${year}/${month}`)
            .then((r) => { setReport(r.data); setReportType("monthly"); })
            .finally(() => setLoadingMonthly(false));
    };

    const yearOptions = YEARS.map((y) => ({ value: y, label: y }));
    const monthOptions = MONTHS.map((m, i) => ({ value: String(i + 1), label: m }));

    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: tk.bgGradient,
                color: tk.titleText,
                fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                transition: "background 0.4s ease, color 0.3s ease",
            }}
        >
            <Sidebar
                onSync={() => { }}
                onLogout={() => { window.location.href = "/login"; }}
                syncing={false}
                theme={theme}
                onToggleTheme={() =>
                    setTheme((p) => (p === "dark" ? "light" : "dark"))
                }
            />

            <main
                style={{
                    flex: 1,
                    minWidth: 0,
                    padding: "40px 44px",
                    marginLeft: "0px",
                    boxSizing: "border-box",
                    transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1)",
                }}
            >
                {/* Page header */}
                <div style={{ marginBottom: "44px" }}>
                    <p
                        style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "#818cf8",
                            marginBottom: "8px",
                            marginTop: 0,
                        }}
                    >
                        Analysis
                    </p>
                    <h1
                        style={{
                            fontSize: "34px",
                            fontWeight: 800,
                            margin: 0,
                            letterSpacing: "-0.03em",
                            color: tk.titleText,
                            lineHeight: 1.1,
                        }}
                    >
                        Reports
                    </h1>
                    <p
                        style={{
                            marginTop: "10px",
                            fontSize: "13px",
                            color: tk.labelText,
                        }}
                    >
                        Generate yearly or monthly summaries of your transactions.
                    </p>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "20px",
                        marginBottom: "28px",
                    }}
                >
                    {/* Yearly report panel */}
                    <GlassPanel theme={theme}>
                        <p
                            style={{
                                margin: "0 0 6px",
                                fontSize: "10px",
                                fontWeight: 700,
                                letterSpacing: "0.10em",
                                textTransform: "uppercase",
                                color: "#818cf8",
                            }}
                        >
                            Yearly
                        </p>
                        <h2
                            style={{
                                margin: "0 0 20px",
                                fontSize: "18px",
                                fontWeight: 700,
                                color: tk.titleText,
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Annual Summary
                        </h2>

                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            <StyledSelect
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                options={yearOptions}
                                theme={theme}
                            />
                            <GenerateButton onClick={getYearlyReport} loading={loadingYearly}>
                                Generate Report
                            </GenerateButton>
                        </div>
                    </GlassPanel>

                    {/* Monthly report panel */}
                    <GlassPanel theme={theme}>
                        <p
                            style={{
                                margin: "0 0 6px",
                                fontSize: "10px",
                                fontWeight: 700,
                                letterSpacing: "0.10em",
                                textTransform: "uppercase",
                                color: "#818cf8",
                            }}
                        >
                            Monthly
                        </p>
                        <h2
                            style={{
                                margin: "0 0 20px",
                                fontSize: "18px",
                                fontWeight: 700,
                                color: tk.titleText,
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Month Breakdown
                        </h2>

                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            <StyledSelect
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                options={yearOptions}
                                theme={theme}
                            />
                            <StyledSelect
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                options={monthOptions}
                                theme={theme}
                            />
                            <GenerateButton onClick={getMonthlyReport} loading={loadingMonthly}>
                                Generate Report
                            </GenerateButton>
                        </div>
                    </GlassPanel>
                </div>

                {/* Report result */}
                {report && (
                    <GlassPanel theme={theme}>
                        {/* Result header */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "20px",
                                flexWrap: "wrap",
                                gap: "10px",
                            }}
                        >
                            <div>
                                <p
                                    style={{
                                        margin: "0 0 4px",
                                        fontSize: "10px",
                                        fontWeight: 700,
                                        letterSpacing: "0.10em",
                                        textTransform: "uppercase",
                                        color: "#818cf8",
                                    }}
                                >
                                    Result
                                </p>
                                <h2
                                    style={{
                                        margin: 0,
                                        fontSize: "18px",
                                        fontWeight: 700,
                                        color: tk.titleText,
                                        letterSpacing: "-0.02em",
                                    }}
                                >
                                    {reportType === "yearly"
                                        ? `${year} Annual Report`
                                        : `${MONTHS[parseInt(month, 10) - 1]} ${year}`}
                                </h2>
                            </div>

                            {/* Net flow badge */}
                            {report.total_credits !== undefined &&
                                report.total_debits !== undefined && (
                                    <span
                                        style={{
                                            background:
                                                report.total_credits - report.total_debits >= 0
                                                    ? "rgba(16,185,129,0.15)"
                                                    : "rgba(239,68,68,0.15)",
                                            border:
                                                report.total_credits - report.total_debits >= 0
                                                    ? "1px solid rgba(16,185,129,0.30)"
                                                    : "1px solid rgba(239,68,68,0.30)",
                                            color:
                                                report.total_credits - report.total_debits >= 0
                                                    ? "#34d399"
                                                    : "#f87171",
                                            borderRadius: "10px",
                                            padding: "6px 14px",
                                            fontSize: "12px",
                                            fontWeight: 700,
                                            fontVariantNumeric: "tabular-nums",
                                        }}
                                    >
                                        Net {report.total_credits - report.total_debits >= 0 ? "+" : ""}
                                        {formatCurrency(report.total_credits - report.total_debits)}
                                    </span>
                                )}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <StatRow
                                label="Total Debits"
                                value={formatCurrency(report.total_debits)}
                                accent="red"
                                theme={theme}
                            />
                            <StatRow
                                label="Total Credits"
                                value={formatCurrency(report.total_credits)}
                                accent="green"
                                theme={theme}
                            />
                            <StatRow
                                label="Transactions"
                                value={report.transaction_count.toLocaleString()}
                                accent="indigo"
                                theme={theme}
                            />
                        </div>
                    </GlassPanel>
                )}
            </main>
        </div>
    );
}

export default Reports;