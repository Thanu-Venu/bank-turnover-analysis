import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

/* ─── shared token helper ───────────────────────────────────────────────────── */
const t = (theme) => ({
    dark: theme !== "light",
    axisColor: theme !== "light" ? "#475569" : "#cbd5e1",
    gridColor: theme !== "light" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)",
    labelColor: theme !== "light" ? "#64748b" : "#94a3b8",
    tickColor: theme !== "light" ? "#64748b" : "#94a3b8",
    tooltipBg: theme !== "light" ? "rgba(5,13,26,0.85)" : "rgba(255,255,255,0.92)",
    tooltipBorder: theme !== "light" ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.08)",
    tooltipText: theme !== "light" ? "#f1f5f9" : "#0f172a",
    tooltipSub: theme !== "light" ? "#64748b" : "#94a3b8",
    legendText: theme !== "light" ? "#94a3b8" : "#64748b",
    titleText: theme !== "light" ? "#f1f5f9" : "#0f172a",
});

/* ─── custom tooltip ────────────────────────────────────────────────────────── */
function CustomTooltip({ active, payload, label, theme }) {
    if (!active || !payload?.length) return null;
    const tk = t(theme);

    const formatLKR = (v) =>
        new Intl.NumberFormat("en-LK", {
            style: "currency",
            currency: "LKR",
            minimumFractionDigits: 0,
        }).format(v);

    return (
        <div
            style={{
                backgroundColor: tk.tooltipBg,
                border: tk.tooltipBorder,
                borderRadius: "14px",
                padding: "14px 18px",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                minWidth: "180px",
            }}
        >
            <p
                style={{
                    margin: "0 0 10px",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#818cf8",
                }}
            >
                {label}
            </p>
            {payload.map((entry) => (
                <div
                    key={entry.dataKey}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "24px",
                        marginBottom: "6px",
                    }}
                >
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "7px",
                            fontSize: "13px",
                            color: tk.tooltipSub,
                        }}
                    >
                        <span
                            style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: entry.color,
                                display: "inline-block",
                                flexShrink: 0,
                            }}
                        />
                        {entry.name}
                    </span>
                    <span
                        style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: entry.color,
                            fontVariantNumeric: "tabular-nums",
                        }}
                    >
                        {formatLKR(entry.value)}
                    </span>
                </div>
            ))}
        </div>
    );
}

/* ─── custom legend ─────────────────────────────────────────────────────────── */
function CustomLegend({ payload, theme }) {
    const tk = t(theme);
    return (
        <div
            style={{
                display: "flex",
                gap: "24px",
                justifyContent: "center",
                marginTop: "16px",
            }}
        >
            {payload?.map((entry) => (
                <span
                    key={entry.value}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "7px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: tk.legendText,
                        letterSpacing: "0.04em",
                    }}
                >
                    <span
                        style={{
                            display: "inline-block",
                            width: "20px",
                            height: "3px",
                            borderRadius: "2px",
                            backgroundColor: entry.color,
                        }}
                    />
                    {entry.value}
                </span>
            ))}
        </div>
    );
}

/* ─── main component ────────────────────────────────────────────────────────── */
function MonthlyTrendChart({ data, theme = "dark" }) {
    const tk = t(theme);

    const formatYAxis = (v) => {
        if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
        if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
        return v;
    };

    return (
        <div style={{ width: "100%" }}>
            {/* Section label is rendered by Dashboard's GlassPanel wrapper,
                but we keep a subtle subtitle here for standalone use */}
            <div style={{ width: "100%", height: "320px" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                    >
                        <defs>
                            {/* Credits gradient fill */}
                            <linearGradient id="gradCredits" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            {/* Debits gradient fill */}
                            <linearGradient id="gradDebits" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.20} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="4 4"
                            stroke={tk.gridColor}
                            vertical={false}
                        />

                        <XAxis
                            dataKey="month"
                            tick={{ fill: tk.tickColor, fontSize: 11, fontWeight: 500 }}
                            interval={0}
                            axisLine={{ stroke: tk.axisColor }}
                            tickLine={false}
                        />

                        <YAxis
                            tickFormatter={formatYAxis}
                            tick={{ fill: tk.tickColor, fontSize: 11, fontWeight: 500 }}
                            axisLine={false}
                            tickLine={false}
                            width={56}
                        />

                        <Tooltip
                            content={<CustomTooltip theme={theme} />}
                            cursor={{
                                stroke: tk.axisColor,
                                strokeWidth: 1,
                                strokeDasharray: "4 4",
                            }}
                        />

                        <Legend content={<CustomLegend theme={theme} />} />

                        <Area
                            type="monotone"
                            dataKey="total_credits"
                            name="Credits"
                            stroke="#10b981"
                            strokeWidth={2.5}
                            fill="url(#gradCredits)"
                            dot={false}
                            activeDot={{
                                r: 5,
                                fill: "#10b981",
                                stroke: tk.dark ? "#050d1a" : "#fff",
                                strokeWidth: 2,
                            }}
                        />

                        <Area
                            type="monotone"
                            dataKey="total_debits"
                            name="Debits"
                            stroke="#ef4444"
                            strokeWidth={2.5}
                            fill="url(#gradDebits)"
                            dot={false}
                            activeDot={{
                                r: 5,
                                fill: "#ef4444",
                                stroke: tk.dark ? "#050d1a" : "#fff",
                                strokeWidth: 2,
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
}

export default MonthlyTrendChart;