import { useState } from "react";
import api from "../services/api";

function Reports() {

    const [year, setYear] = useState("2026");
    const [month, setMonth] = useState("5");

    const [report, setReport] = useState(null);

    const getYearlyReport = () => {
        api
            .get(`/reports/yearly/${year}`)
            .then((response) => {
                setReport(response.data);
            });
    };

    const getMonthlyReport = () => {
        api
            .get(`/reports/monthly/${year}/${month}`)
            .then((response) => {
                setReport(response.data);
            });
    };

    const formatCurrency = (value) =>
        new Intl.NumberFormat(
            "en-LK",
            {
                style: "currency",
                currency: "LKR"
            }
        ).format(value);

    return (
        <div
            style={{
                padding: "40px",
                color: "white",
            }}
        >
            <h1>Reports</h1>

            <div
                style={{
                    background: "#1e293b",
                    padding: "20px",
                    borderRadius: "15px",
                    marginBottom: "20px",
                }}
            >
                <h2>Yearly Report</h2>

                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                </select>

                <button
                    onClick={getYearlyReport}
                >
                    Generate
                </button>
            </div>

            <div
                style={{
                    background: "#1e293b",
                    padding: "20px",
                    borderRadius: "15px",
                }}
            >
                <h2>Monthly Report</h2>

                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                </select>

                <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                >
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>

                <button
                    onClick={getMonthlyReport}
                >
                    Generate
                </button>
            </div>

            {report && (
                <div
                    style={{
                        marginTop: "30px",
                        background: "#334155",
                        padding: "20px",
                        borderRadius: "15px",
                    }}
                >
                    <h2>Report Result</h2>

                    <p>
                        Total Debits:
                        {formatCurrency(report.total_debits)}
                    </p>

                    <p>
                        Total Credits:
                        {formatCurrency(report.total_credits)}
                    </p>

                    <p>
                        Transactions:
                        {report.transaction_count}
                    </p>
                </div>
            )}
        </div>
    );
}

export default Reports;