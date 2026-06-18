from dataclasses import dataclass
import re

@dataclass
class Transaction:
    transaction_date: str
    value_date: str
    description: str
    debit: float
    credit: float
    balance: float

DATE_PATTERN = r"\d{2}-[A-Za-z]{3}-\d{4}"

def is_transaction_start(line):
    matches = re.findall(DATE_PATTERN, line)
    return len(matches) >= 2

def clean_amount(amount):
    return float(amount.replace(",", ""))

def parse_transactions(text):

    transactions = []

    lines = [line.strip() for line in text.splitlines()]
    for index, line in enumerate(lines):

        if not is_transaction_start(line):
            continue

        parts = line.split()

        try:
            transaction_date = parts[0]
            value_date = parts[1]

            debit = clean_amount(parts[-3])
            credit = clean_amount(parts[-2])
            balance = clean_amount(parts[-1])

            middle_text = " ".join(parts[2:-3])

            previous_line = (
                lines[index - 1].strip()
                if index > 0
                else ""
            )

            next_line = (
                lines[index + 1].strip()
                if index < len(lines) - 1
                else ""
            )

            description_parts = []

            if middle_text:


                description_parts.append(middle_text)


            else:

                if previous_line and not is_transaction_start(previous_line):
                    description_parts.append(previous_line)

                if next_line and not is_transaction_start(next_line):
                    description_parts.append(next_line)


            description = " ".join(description_parts)

            transaction = Transaction(
                transaction_date=transaction_date,
                value_date=value_date,
                description=description,
                debit=debit,
                credit=credit,
                balance=balance
            )

            transactions.append(transaction)

        except Exception as e:
            print(f"Failed to parse line: {line}")
            print(e)

    return transactions

