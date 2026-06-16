from app.services.pdf_parser import extract_text
from app.services.transaction_parser import parse_transactions

text = extract_text("test_data/multi-line.pdf")

transactions = parse_transactions(text)

print("\nTRANSACTIONS FOUND\n")

for transaction in transactions:
    print(transaction)
