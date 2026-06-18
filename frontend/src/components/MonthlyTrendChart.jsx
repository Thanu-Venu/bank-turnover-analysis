import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

function MonthlyTrendChart({ data }) {
    return (
        <div
            style={{
                marginTop: "30px",
                width: "100%",
                height: "400px"
            }}
        >
            <h2>Monthly Turnover Trend</h2>

            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="total_credits"
                        name="Credits"
                        stroke="#22c55e"
                        strokeWidth={3}
                    />

                    <Line
                        type="monotone"
                        dataKey="total_debits"
                        name="Debits"
                        stroke="#ef4444"
                        strokeWidth={3}
                    />
                    <Legend />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default MonthlyTrendChart;