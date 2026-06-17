from app.services.pdf_parser import extract_text
from app.services.transaction_parser import parse_transactions

def process_statement(pdf_path):
    text = extract_text(pdf_path)
    transactions = parse_transactions(text)
    return transactions