from app.services.pdf_parser import extract_text
from app.services.transaction_parser import parse_transactions

def is_current_account_statement(text):

    indicators=[
        "Regular Current",
        "Transaction Date",
        "Debits",
        "Credits",
        "Balance"
    ]

    matches = 0
    for indicator in indicators:
        if indicator in text:
            matches += 1

    return matches >= 3

def process_statement(pdf_path):
    text = extract_text(pdf_path)
    if not is_current_account_statement(text):
        return None

    transactions = parse_transactions(text)
    return transactions