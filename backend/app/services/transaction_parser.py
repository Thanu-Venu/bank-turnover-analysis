from dataclasses import dataclass

@dataclass
class Transaction:
    transaction_date:str
    value_date:str
    description:str
    debit:str
    credit:str
    balance:float

import re

DATE_PATTERN = r"\d{2}-[A-Za-z]{3}-\d{4}"


def is_transaction_start(line):
    matches = re.findall(DATE_PATTERN, line)

    return len(matches) >= 2

def clean_amount(amount):
    return float(amount.replace(",",""))


def parse_transactions(text):
    transactions= []

    lines = text.splitlines()

    for line in lines:

        if is_transaction_start(line):

           parts=line.split()

           transaction_date=parts[0]
           value_date=parts[1]

           debit=clean_amount(parts[2])
           credit=clean_amount(parts[3])
           balance=clean_amount(parts[4])

           transaction=Transaction(
            transaction_date=transaction_date,
            value_date=value_date,
            description="",
            debit=debit,
            credit=credit,
            balance=balance
           )

           transactions.append(transaction)
    return transactions