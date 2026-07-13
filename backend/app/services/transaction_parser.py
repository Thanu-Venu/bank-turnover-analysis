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


# Accept several common date formats (e.g. 02-May-2026, 02/05/2026, 02.05.2026)
DATE_PATTERNS = [
    r"\d{1,2}-[A-Za-z]{3}-\d{4}",
    r"\d{1,2}/\d{1,2}/\d{4}",
    r"\d{1,2}\.\d{1,2}\.\d{4}",
    r"\d{1,2} [A-Za-z]{3} \d{4}",
]

AMOUNT_RE = re.compile(r"[-+]?[0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})")


def find_date_tokens(line):
    for pat in DATE_PATTERNS:
        m = re.findall(pat, line)
        if m:
            return m
    return []


def clean_amount(amount):
    return float(amount.replace(",", ""))


def parse_transactions(text):
    transactions = []

    lines = [line.rstrip() for line in text.splitlines()]
    for index, line in enumerate(lines):
        line_stripped = line.strip()
        if not line_stripped:
            continue

        # look for a date at the start of the line
        leading_date = None
        for pat in DATE_PATTERNS:
            m = re.match(r"^\s*(%s)" % pat, line_stripped)
            if m:
                leading_date = m.group(1)
                break

        if not leading_date:
            continue

        # collect amounts from the line
        amounts = AMOUNT_RE.findall(line_stripped)
        if not amounts:
            # try next line if amounts may be on following line
            next_line = lines[index + 1].strip() if index + 1 < len(lines) else ""
            amounts = AMOUNT_RE.findall(next_line)

        if not amounts:
            # cannot determine amounts, skip
            continue

        try:
            # transaction_date is the first token matching a date pattern
            transaction_date = leading_date

            # try find a second date (value_date) after the first date
            rest = line_stripped[len(leading_date):].strip()
            value_date = None
            for pat in DATE_PATTERNS:
                m = re.match(r"^(%s)" % pat, rest)
                if m:
                    value_date = m.group(1)
                    rest = rest[len(value_date):].strip()
                    break

            # determine debit/credit/balance from trailing amounts
            # prefer last three amounts as debit, credit, balance
            if len(amounts) >= 3:
                debit = clean_amount(amounts[-3])
                credit = clean_amount(amounts[-2])
                balance = clean_amount(amounts[-1])
                # description is the text between the value_date (if present) and the amounts
                desc_part = line_stripped
                # remove leading dates
                desc_part = re.sub(r"^\s*%s" % re.escape(transaction_date), "", desc_part).strip()
                if value_date:
                    desc_part = re.sub(r"^\s*%s" % re.escape(value_date), "", desc_part).strip()
                # remove trailing amounts
                desc_part = AMOUNT_RE.sub("", desc_part).strip()

            elif len(amounts) == 2:
                # assume debit or credit plus balance; we will treat the first as debit and second as balance
                debit = clean_amount(amounts[-2])
                credit = 0.0
                balance = clean_amount(amounts[-1])
                desc_part = line_stripped
                desc_part = re.sub(r"^\s*%s" % re.escape(transaction_date), "", desc_part).strip()
                if value_date:
                    desc_part = re.sub(r"^\s*%s" % re.escape(value_date), "", desc_part).strip()
                desc_part = AMOUNT_RE.sub("", desc_part).strip()

            else:
                # single amount — treat as balance only; skip because insufficient data
                continue

            # try to augment description with previous/next lines if they are continuation lines
            description = desc_part
            prev_line = lines[index - 1].strip() if index > 0 else ""
            next_line = lines[index + 1].strip() if index + 1 < len(lines) else ""
            if prev_line and not find_date_tokens(prev_line):
                description = prev_line + " " + description
            if next_line and not find_date_tokens(next_line) and not AMOUNT_RE.search(next_line):
                description = description + " " + next_line

            transaction = Transaction(
                transaction_date=transaction_date,
                value_date=value_date,
                description=" ".join(description.split()),
                debit=debit,
                credit=credit,
                balance=balance,
            )

            transactions.append(transaction)

        except Exception as e:
            print(f"Failed to parse line: {line_stripped}")
            print(e)

    return transactions

