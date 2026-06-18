function SummaryCard({
    title,
    value,
    background
}) {
    return (
        <div
            style={{
                backgroundColor: background,
                padding: "25px",
                borderRadius: "18px",
                textAlign: "center",
                boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
            }}
        >
            <h3
                style={{
                    color: "#cbd5e1",
                    marginBottom: "20px",
                }}
            >
                {title}
            </h3>

            <h2
                style={{
                    fontSize: "28px",
                    margin: 0,
                }}
            >
                {value}
            </h2>
        </div>
    );
}

export default SummaryCard;