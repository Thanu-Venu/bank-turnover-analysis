import { useState } from "react";

const formatCurrency = (value) =>
    new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: "LKR",
        minimumFractionDigits: 2,
    }).format(value);

/* ─── single row ────────────────────────────────────────────────────────────── */
function TxRow({ tx, index, theme }) {
    const [hovered, setHovered] = useState(false);
    const dark = theme !== "light";

    const rowBg = hovered
        ? dark
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.03)"
        : "transparent";

    const borderColor = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
    const textPrimary = dark ? "#f1f5f9" : "#0f172a";
    const textMuted = dark ? "#64748b" : "#94a3b8";

    const isDebit = tx.debit > 0;
    const isCredit = tx.credit > 0;

    return (
        <tr
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                backgroundColor: rowBg,
                borderBottom: `1px solid ${borderColor}`,
                transition: "background-color 0.15s ease",
                cursor: "default",
            }}
        >
            {/* Date */}
            <td
                style={{
                    padding: "13px 16px",
                    fontSize: "12px",
                    color: textMuted,
                    fontVariantNumeric: "tabular-nums",
                    whiteSpace: "nowrap",
                }}
            >
                {tx.date}
            </td>

            {/* Description */}
            <td
                style={{
                    padding: "13px 16px",
                    fontSize: "13px",
                    color: textPrimary,
                    maxWidth: "260px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
                title={tx.description}
            >
                {tx.description}
            </td>

            {/* Debit */}
            <td style={{ padding: "13px 16px", textAlign: "right" }}>
                {isDebit ? (
                    <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            background: "rgba(239,68,68,0.12)",
                            color: "#f87171",
                            borderRadius: "7px",
                            padding: "3px 9px",
                            fontSize: "12px",
                            fontWeight: 600,
                            fontVariantNumeric: "tabular-nums",
                            border: "1px solid rgba(239,68,68,0.20)",
                        }}
                    >
                        ▼ {formatCurrency(tx.debit)}
                    </span>
                ) : (
                    <span style={{ color: textMuted, fontSize: "12px" }}>—</span>
                )}
            </td>

            {/* Credit */}
            <td style={{ padding: "13px 16px", textAlign: "right" }}>
                {isCredit ? (
                    <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            background: "rgba(16,185,129,0.12)",
                            color: "#34d399",
                            borderRadius: "7px",
                            padding: "3px 9px",
                            fontSize: "12px",
                            fontWeight: 600,
                            fontVariantNumeric: "tabular-nums",
                            border: "1px solid rgba(16,185,129,0.20)",
                        }}
                    >
                        ▲ {formatCurrency(tx.credit)}
                    </span>
                ) : (
                    <span style={{ color: textMuted, fontSize: "12px" }}>—</span>
                )}
            </td>

            {/* Balance */}
            <td
                style={{
                    padding: "13px 16px",
                    textAlign: "right",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: textPrimary,
                    fontVariantNumeric: "tabular-nums",
                    whiteSpace: "nowrap",
                }}
            >
                {formatCurrency(tx.balance)}
            </td>
        </tr>
    );
}

/* ─── main component ────────────────────────────────────────────────────────── */
function RecentTransactions({ transactions, theme = "dark" }) {
    const dark = theme !== "light";

    const headerBg = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
    const headerText = dark ? "#64748b" : "#94a3b8";
    const borderColor = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";

    if (!transactions?.length) {
        return (
            <div
                style={{
                    textAlign: "center",
                    padding: "48px 0",
                    color: dark ? "#475569" : "#94a3b8",
                    fontSize: "14px",
                }}
            >
                No recent transactions to display.
            </div>
        );
    }

    return (
        <div style={{ overflowX: "auto", margin: "0 -4px" }}>
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "13px",
                }}
            >
                <thead>
                    <tr
                        style={{
                            backgroundColor: headerBg,
                            borderBottom: `1px solid ${borderColor}`,
                        }}
                    >
                        {["Date", "Description", "Debit", "Credit", "Balance"].map(
                            (col, i) => (
                                <th
                                    key={col}
                                    style={{
                                        padding: "10px 16px",
                                        textAlign: i >= 2 ? "right" : "left",
                                        fontSize: "10px",
                                        fontWeight: 700,
                                        letterSpacing: "0.09em",
                                        textTransform: "uppercase",
                                        color: headerText,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {col}
                                </th>
                            )
                        )}
                    </tr>
                </thead>

                <tbody>
                    {transactions.map((tx, index) => (
                        <TxRow
                            key={index}
                            tx={tx}
                            index={index}
                            theme={theme}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default RecentTransactions;