function RecentTransactions({ transactions }) {

    const formatCurrency = (value) => {

        return new Intl.NumberFormat(
            "en-LK",
            {
                style: "currency",
                currency: "LKR"
            }
        ).format(value);
    };

    return (
        <div
            style={{
                backgroundColor: "#1e293b",
                padding: "25px",
                borderRadius: "20px",
                marginTop: "40px"
            }}
        >
            <h2
                style={{
                    marginBottom: "20px"
                }}
            >
                Recent Transactions
            </h2>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    color: "white"
                }}
            >
                <thead>
                    <tr
                        style={{
                            backgroundColor: "#334155"
                        }}
                    >
                        <th style={{ padding: "12px" }}>Date</th>
                        <th style={{ padding: "12px" }}>Description</th>
                        <th style={{ padding: "12px" }}>Debit</th>
                        <th style={{ padding: "12px" }}>Credit</th>
                        <th style={{ padding: "12px" }}>Balance</th>
                    </tr>
                </thead>

                <tbody>
                    {transactions.map((tx, index) => (
                        <tr
                            key={index}
                            style={{
                                borderBottom: "1px solid #475569"
                            }}
                        >
                            <td style={{ padding: "12px" }}>
                                {tx.date}
                            </td>

                            <td style={{ padding: "12px" }}>
                                {tx.description}
                            </td>

                            <td
                                style={{
                                    padding: "12px",
                                    color: "#ef4444"
                                }}
                            >
                                {tx.debit > 0
                                    ? formatCurrency(tx.debit)
                                    : "-"}
                            </td>

                            <td
                                style={{
                                    padding: "12px",
                                    color: "#22c55e"
                                }}
                            >
                                {tx.credit > 0
                                    ? formatCurrency(tx.credit)
                                    : "-"}
                            </td>

                            <td style={{ padding: "12px" }}>
                                {formatCurrency(tx.balance)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default RecentTransactions;