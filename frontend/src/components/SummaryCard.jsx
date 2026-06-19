import { useState } from "react";

/**
 * SummaryCard — glassmorphism card with gradient accent border and hover lift.
 *
 * Props:
 *  title      {string}  — card label
 *  value      {string|number} — displayed value
 *  icon       {string}  — emoji/icon shown top-left
 *  accent     {string}  — one of "indigo" | "violet" | "green" | "red" (default: "indigo")
 *  theme      {string}  — "dark" | "light"
 *  trend      {number}  — optional % change (positive = up, negative = down)
 */
function SummaryCard({ title, value, icon, accent = "indigo", theme = "dark", trend }) {
    const [hovered, setHovered] = useState(false);
    const dark = theme !== "light";

    const ACCENTS = {
        indigo: ["#6366f1", "#818cf8"],
        violet: ["#7c3aed", "#c084fc"],
        green: ["#10b981", "#34d399"],
        red: ["#ef4444", "#fb923c"],
    };

    const [colorA, colorB] = ACCENTS[accent] || ACCENTS.indigo;

    const cardBg = dark
        ? hovered
            ? "rgba(255,255,255,0.09)"
            : "rgba(255,255,255,0.05)"
        : hovered
            ? "rgba(255,255,255,0.85)"
            : "rgba(255,255,255,0.6)";

    const border = dark
        ? "1px solid rgba(255,255,255,0.10)"
        : "1px solid rgba(0,0,0,0.07)";

    const titleColor = dark ? "#94a3b8" : "#64748b";
    const valueColor = dark ? "#f1f5f9" : "#0f172a";
    const trendPositive = dark ? "#34d399" : "#059669";
    const trendNegative = dark ? "#f87171" : "#dc2626";

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: "relative",
                borderRadius: "18px",
                padding: "2px",               /* space for gradient border */
                background: `linear-gradient(135deg, ${colorA}55, ${colorB}33)`,
                boxShadow: hovered
                    ? `0 12px 40px ${colorA}30, 0 2px 8px rgba(0,0,0,0.18)`
                    : "0 2px 12px rgba(0,0,0,0.12)",
                transition: "box-shadow 0.25s ease, transform 0.25s ease",
                transform: hovered ? "translateY(-3px)" : "translateY(0)",
                cursor: "default",
            }}
        >
            {/* Inner glass panel */}
            <div
                style={{
                    borderRadius: "16px",
                    backgroundColor: cardBg,
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border,
                    padding: "24px 22px",
                    transition: "background-color 0.25s ease",
                }}
            >
                {/* Top row: icon + title */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "16px",
                    }}
                >
                    {icon && (
                        <span
                            style={{
                                fontSize: "20px",
                                width: "36px",
                                height: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "10px",
                                background: `linear-gradient(135deg, ${colorA}30, ${colorB}20)`,
                                border: `1px solid ${colorA}40`,
                                flexShrink: 0,
                            }}
                        >
                            {icon}
                        </span>
                    )}
                    <span
                        style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: titleColor,
                        }}
                    >
                        {title}
                    </span>
                </div>

                {/* Value */}
                <div
                    style={{
                        fontSize: "clamp(14px, 1.6vw, 22px)",
                        fontWeight: 700,
                        color: valueColor,
                        fontVariantNumeric: "tabular-nums",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.1,
                        wordBreak: "keep-all",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        marginBottom: trend !== undefined ? "12px" : 0,
                    }}
                >
                    {value}
                </div>

                {/* Optional trend badge */}
                {trend !== undefined && (
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: trend >= 0 ? trendPositive : trendNegative,
                            background: trend >= 0
                                ? `${trendPositive}18`
                                : `${trendNegative}18`,
                            padding: "3px 8px",
                            borderRadius: "6px",
                        }}
                    >
                        {trend >= 0 ? "▲" : "▼"} {Math.abs(trend).toFixed(1)}%
                    </div>
                )}

                {/* Decorative gradient glow dot (bottom-right) */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "12px",
                        right: "16px",
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${colorA}30 0%, transparent 70%)`,
                        pointerEvents: "none",
                    }}
                />
            </div>
        </div>
    );
}

export default SummaryCard;