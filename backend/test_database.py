from app.services.pdf_parser import extract_text
from app.services.transaction_service import save_transactions
from app.services.transaction_parser import parse_transactions
text=extract_text("test_data/multi-line.pdf")

transactions= parse_transactions(text)
save_transactions(transactions)

print(f"Saved {len(transactions)} transactions to the database")